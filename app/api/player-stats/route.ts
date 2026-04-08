import { admin, db, getFirestoreForToken, getProjectIdForToken } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const FALLBACK_PLAYCRICKET_URLS: Record<string, string> = {
  "ravip.2006@gmail.com": "https://play.cricket.com.au/player/90918ca4-b93a-4d46-9f0c-000135fee349/ravi-prakash?tab=career",
};
const PLAYCRICKET_API_BASE = "https://grassrootsapiproxy.cricket.com.au";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function resolvePlayCricketUrlFromUsersCollection(
  firestore: FirebaseFirestore.Firestore,
  email: string
) {
  const normalized = normalizeEmail(email);
  const usersRef = firestore.collection("users");

  const byEmail = await usersRef.where("email", "==", normalized).limit(1).get();
  const doc = byEmail.docs[0];
  if (!doc) return null;

  const data = doc.data() || {};
  const candidates = [
    data.playCricketUrl,
    data.playcricketUrl,
    data.playCricketProfileUrl,
    data.playCricket,
  ];

  const found = candidates.find((v) => typeof v === "string" && v.trim());
  return typeof found === "string" ? found.trim() : null;
}

function normalizePlayCricketUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  return trimmed.includes("tab=career")
    ? trimmed
    : `${trimmed}${trimmed.includes("?") ? "&" : "?"}tab=career`;
}

function normalizePlayCricketSummaryUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (/tab=career/i.test(trimmed)) {
    return trimmed.replace(/tab=career/gi, "tab=summary");
  }

  return trimmed.includes("tab=summary")
    ? trimmed
    : `${trimmed}${trimmed.includes("?") ? "&" : "?"}tab=summary`;
}

function extractPlayCricketPlayerId(playCricketUrl: string) {
  const pathMatch = playCricketUrl.match(/\/player\/([0-9a-f-]{36})/i);
  if (pathMatch?.[1]) return pathMatch[1];

  const genericUuid = playCricketUrl.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return genericUuid?.[1] || null;
}

async function fetchPlayCricketJson(path: string, params: Record<string, string>) {
  const url = new URL(`${PLAYCRICKET_API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json().catch(() => null);
}

function toNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function stripUndefined<T extends Record<string, any>>(obj: T) {
  const entries = Object.entries(obj).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as Partial<T>;
}

function parseCareerStatsFromText(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  const battingSection = normalized.match(/Batting\s*(.*?)\s*Bowling/i)?.[1] || "";
  const bowlingSection = normalized.match(/Bowling\s*(.*?)\s*Fielding/i)?.[1] || "";
  const fieldingSection = normalized.match(/Fielding\s*(.*?)(PlayCricket App|$)/i)?.[1] || "";

  const matchesPlayed =
    toNumber(normalized.match(/Reset Filters\s*(\d+)\s+Matches/i)?.[1]) ||
    toNumber(normalized.match(/(\d+)\s+Matches/i)?.[1]);

  const runsScored = toNumber(battingSection.match(/Runs\s*(\d+)/i)?.[1]);
  const wickets = toNumber(bowlingSection.match(/Wickets\s*(\d+)/i)?.[1]);
  const battingAverage = toNumber(battingSection.match(/Average\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1]);
  const strikeRate = toNumber(battingSection.match(/Strike\s*Rate\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1]);

  const innings = toNumber(battingSection.match(/Innings\s*(\d+)/i)?.[1]);
  const highScore = toNumber(battingSection.match(/High\s*Score\s*(\d+)/i)?.[1]);
  const hundreds = toNumber(battingSection.match(/100s\s*(\d+)/i)?.[1]);
  const fifties = toNumber(battingSection.match(/50s\s*(\d+)/i)?.[1]);
  const ducks = toNumber(battingSection.match(/Ducks\s*(\d+)/i)?.[1]);
  const notOuts = toNumber(battingSection.match(/Not\s*Outs\s*(\d+)/i)?.[1]);

  const overs = toNumber(bowlingSection.match(/Overs\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1]);
  const maidens = toNumber(bowlingSection.match(/Maidens\s*(\d+)/i)?.[1]);
  const bowlingRuns = toNumber(bowlingSection.match(/Runs\s*(\d+)/i)?.[1]);
  const bestBowling = bowlingSection.match(/Best\s*Bowling\s*([0-9]+\s*-\s*[0-9]+)/i)?.[1]?.replace(/\s+/g, "") || undefined;
  const bowlingAverage = toNumber(bowlingSection.match(/Average\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1]);
  const economy = toNumber(bowlingSection.match(/Economy\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1]);

  const totalCatches = toNumber(fieldingSection.match(/Total\s*Catches\s*(\d+)/i)?.[1]);
  const wicketKeeperCatches = toNumber(fieldingSection.match(/Wicket\s*Keeper\s*Catches\s*(\d+)/i)?.[1]);
  const nonWicketKeeperCatches = toNumber(fieldingSection.match(/Non\s*Wicket\s*Keeper\s*Catches\s*(\d+)/i)?.[1]);
  const runOuts = toNumber(fieldingSection.match(/Run\s*Outs\s*(\d+)/i)?.[1]);
  const stumpings = toNumber(fieldingSection.match(/Stumpings\s*(\d+)/i)?.[1]);

  if (
    matchesPlayed === undefined &&
    runsScored === undefined &&
    wickets === undefined &&
    battingAverage === undefined &&
    strikeRate === undefined &&
    innings === undefined &&
    bowlingAverage === undefined &&
    totalCatches === undefined
  ) {
    return null;
  }

  return {
    matchesPlayed,
    innings,
    runsScored,
    wickets,
    battingAverage,
    strikeRate,
    highScore,
    hundreds,
    fifties,
    ducks,
    notOuts,
    overs,
    maidens,
    bowlingRuns,
    bestBowling,
    bowlingAverage,
    economy,
    totalCatches,
    wicketKeeperCatches,
    nonWicketKeeperCatches,
    runOuts,
    stumpings,
  };
}

function parseSummaryStatsFromText(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  const seasonLabel = normalized.match(/(Current Season|Summer\s+\d{4}\/?\d{0,2}|Winter\s+\d{4})\s+\d+\s+Matches\s+Played/i)?.[1] || "Current Season";
  const matchesPlayed = toNumber(normalized.match(/(\d+)\s+Matches\s+Played/i)?.[1]);
  const runsScored = toNumber(normalized.match(/Runs\s+(\d+)\s+Batting\s+Average/i)?.[1]);
  const battingAverage = toNumber(normalized.match(/Batting\s+Average\s+([0-9]+(?:\.[0-9]+)?)/i)?.[1]);
  const highScore = toNumber(normalized.match(/High\s+Score\s+(\d+)/i)?.[1]);
  const wickets = toNumber(normalized.match(/Wickets\s+(\d+)\s+Bowling\s+Average/i)?.[1]);
  const bowlingAverage = toNumber(normalized.match(/Bowling\s+Average\s+([0-9]+(?:\.[0-9]+)?)/i)?.[1]);
  const bestBowling = normalized.match(/Best\s+Bowling\s+([0-9]+\s*-\s*[0-9]+)/i)?.[1]?.replace(/\s+/g, "") || undefined;
  const totalCatches = toNumber(normalized.match(/Total\s+Catches\s+(\d+)/i)?.[1]);
  const wicketKeeperCatches = toNumber(normalized.match(/Wicket\s+Keeper\s+Catches\s+(\d+)/i)?.[1]);
  const nonWicketKeeperCatches = toNumber(normalized.match(/Non\s+Wicket\s+Keeper\s+Catches\s+(\d+)/i)?.[1]);
  const runOuts = toNumber(normalized.match(/Run\s+Outs\s+(\d+)/i)?.[1]);
  const stumpings = toNumber(normalized.match(/Stumpings\s+(\d+)/i)?.[1]);

  if (
    matchesPlayed === undefined &&
    runsScored === undefined &&
    wickets === undefined &&
    battingAverage === undefined
  ) {
    return null;
  }

  return {
    seasonLabel,
    matchesPlayed,
    runsScored,
    battingAverage,
    highScore,
    wickets,
    bowlingAverage,
    bestBowling,
    totalCatches,
    wicketKeeperCatches,
    nonWicketKeeperCatches,
    runOuts,
    stumpings,
  };
}

async function scrapeCareerStats(playCricketUrl: string) {
  try {
    const playerId = extractPlayCricketPlayerId(normalizePlayCricketUrl(playCricketUrl));
    if (!playerId) return null;

    const data = await fetchPlayCricketJson(`/participants/players/${playerId}/summary-statistics`, {
      seasonId: "",
      organisationId: "",
      matchTypeId: "",
      jsconfig: "eccn:true",
    });

    if (!data || typeof data !== "object") return null;

    return {
      matchesPlayed: toNumber(String((data as any).matches ?? "")),
      innings: toNumber(String((data as any).battingInnings ?? "")),
      runsScored: toNumber(String((data as any).battingAggregate ?? "")),
      wickets: toNumber(String((data as any).bowlingWickets ?? "")),
      battingAverage: toNumber(String((data as any).battingAverage ?? "")),
      strikeRate: toNumber(String((data as any).battingStrikeRate ?? "")),
      highScore: toNumber(String((data as any).battingHighScore ?? "")),
      hundreds: toNumber(String((data as any).batting100s ?? "")),
      fifties: toNumber(String((data as any).batting50s ?? "")),
      ducks: toNumber(String((data as any).batting0s ?? "")),
      notOuts: toNumber(String((data as any).battingNotOuts ?? "")),
      overs: toNumber(String((data as any).bowlingOvers ?? "")),
      maidens: toNumber(String((data as any).bowlingMaidens ?? "")),
      bowlingRuns: toNumber(String((data as any).bowlingRuns ?? "")),
      bestBowling: typeof (data as any).bowlingBestInnings === "string" ? (data as any).bowlingBestInnings : undefined,
      bowlingAverage: toNumber(String((data as any).bowlingAverage ?? "")),
      economy: toNumber(String((data as any).bowlingEconomyRate ?? "")),
      totalCatches: toNumber(String((data as any).fieldingTotalCatches ?? "")),
      wicketKeeperCatches: toNumber(String((data as any).fieldingCatchesWK ?? "")),
      nonWicketKeeperCatches: toNumber(String((data as any).fieldingCatchesNonWK ?? "")),
      runOuts: toNumber(String((data as any).fieldingRunOuts ?? "")),
      stumpings: toNumber(String((data as any).fieldingStumpings ?? "")),
    };
  } catch (error) {
    console.warn("Failed to fetch PlayCricket career stats:", error);
    return null;
  }
}

async function scrapeSummaryStats(playCricketUrl: string) {
  try {
    const playerId = extractPlayCricketPlayerId(normalizePlayCricketSummaryUrl(playCricketUrl));
    if (!playerId) return null;

    const seasons = await fetchPlayCricketJson(`/participants/players/${playerId}/seasons`, {
      jsconfig: "eccn:true",
    });

    const currentSeason = Array.isArray(seasons) ? seasons[0] : null;
    const seasonId = typeof currentSeason?.id === "string" ? currentSeason.id : "";
    const seasonLabel = typeof currentSeason?.name === "string" ? currentSeason.name : "Current Season";

    const data = await fetchPlayCricketJson(`/participants/players/${playerId}/summary-statistics`, {
      seasonId,
      organisationId: "",
      matchTypeId: "",
      jsconfig: "eccn:true",
    });

    if (!data || typeof data !== "object") return null;

    return {
      seasonLabel,
      matchesPlayed: toNumber(String((data as any).matches ?? "")),
      runsScored: toNumber(String((data as any).battingAggregate ?? "")),
      battingAverage: toNumber(String((data as any).battingAverage ?? "")),
      highScore: toNumber(String((data as any).battingHighScore ?? "")),
      wickets: toNumber(String((data as any).bowlingWickets ?? "")),
      bowlingAverage: toNumber(String((data as any).bowlingAverage ?? "")),
      bestBowling: typeof (data as any).bowlingBestInnings === "string" ? (data as any).bowlingBestInnings : undefined,
      totalCatches: toNumber(String((data as any).fieldingTotalCatches ?? "")),
      wicketKeeperCatches: toNumber(String((data as any).fieldingCatchesWK ?? "")),
      nonWicketKeeperCatches: toNumber(String((data as any).fieldingCatchesNonWK ?? "")),
      runOuts: toNumber(String((data as any).fieldingRunOuts ?? "")),
      stumpings: toNumber(String((data as any).fieldingStumpings ?? "")),
    };
  } catch (error) {
    console.warn("Failed to fetch PlayCricket summary stats:", error);
    return null;
  }
}

/**
 * Manual "table" for mapping user email -> stats.
 * Firestore collection: playerStats
 * Doc ID: normalized email (lowercased)
 * Example doc fields:
 * - email: string (optional)
 * - playCricketUrl: string (optional)
 * - stats: {
 *     matchesPlayed?: number;
 *     runsScored?: number;
 *     wickets?: number;
 *     battingAverage?: number;
 *     strikeRate?: number;
 *   }
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const emailParam = url.searchParams.get("email");
    const uidParam = url.searchParams.get("uid");
    const debug = url.searchParams.get("debug") === "1";
    const live = url.searchParams.get("live") === "1";
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";

    const activeDb = bearer ? getFirestoreForToken(bearer) : db;
    const activeProjectId = (bearer ? getProjectIdForToken(bearer) : undefined) || (admin.app()?.options as any)?.projectId;

    console.log("Player stats API called", { emailParam, uidParam, live, bearer: !!bearer, activeProjectId });

    if (!emailParam && !uidParam) {
      return Response.json({ error: "Missing email or uid parameter" }, { status: 400 });
    }

    if (!activeDb) {
      return Response.json({ error: "Database not available" }, { status: 503 });
    }

    let resolvedEmail = emailParam ? normalizeEmail(emailParam) : "";
    const resolvedUid = (uidParam || "").trim();

    if (!resolvedEmail && resolvedUid) {
      const userDoc = await activeDb.collection("users").doc(resolvedUid).get();
      if (userDoc.exists) {
        const userData = userDoc.data() || {};
        const uidEmail = typeof userData.email === "string" ? userData.email.trim().toLowerCase() : "";
        if (uidEmail) {
          resolvedEmail = uidEmail;
        }
      }
    }

    const docId = resolvedEmail || resolvedUid;
    console.log("Resolved identifiers", { resolvedEmail, resolvedUid, docId });
    const doc = await activeDb.collection("playerStats").doc(docId).get();

    if (!doc.exists) {
      const usersCollectionUrl = resolvedEmail
        ? await resolvePlayCricketUrlFromUsersCollection(activeDb, resolvedEmail)
        : null;
      const fallbackUrl = usersCollectionUrl || (resolvedEmail ? FALLBACK_PLAYCRICKET_URLS[resolvedEmail] : undefined);

      if (fallbackUrl) {
        let liveStats: Record<string, number | string | undefined> | null = null;
        let liveSummary: Record<string, number | string | undefined> | null = null;
        if (live) {
          liveStats = await scrapeCareerStats(fallbackUrl);
          liveSummary = await scrapeSummaryStats(fallbackUrl);
        }

        const sanitizedStats = liveStats ? stripUndefined(liveStats) : null;
        const sanitizedSummary = liveSummary ? stripUndefined(liveSummary) : null;

        await activeDb
          .collection("playerStats")
          .doc(docId)
          .set(
            {
              email: docId,
              playCricketUrl: fallbackUrl,
              ...(sanitizedStats
                ? {
                    stats: sanitizedStats,
                    statsSource: "playcricket-live",
                    statsLastSyncedAt: new Date().toISOString(),
                  }
                : null),
              ...(sanitizedSummary
                ? {
                    summary: sanitizedSummary,
                    summarySource: "playcricket-live",
                    summaryLastSyncedAt: new Date().toISOString(),
                  }
                : null),
            },
            { merge: true }
          );

        return Response.json(
          {
            exists: true,
            id: docId,
            email: resolvedEmail || undefined,
            playCricketUrl: fallbackUrl,
            ...(sanitizedStats ? { stats: sanitizedStats, statsSource: "playcricket-live" } : null),
            ...(sanitizedSummary ? { summary: sanitizedSummary, summarySource: "playcricket-live" } : null),
            ...(debug
              ? {
                  debug: {
                    projectId: activeProjectId,
                    docPath: `playerStats/${docId}`,
                    usedFallbackUrl: Boolean(resolvedEmail ? FALLBACK_PLAYCRICKET_URLS[resolvedEmail] : undefined),
                    usedUsersCollectionUrl: Boolean(usersCollectionUrl),
                    liveRequested: live,
                    liveStatsFound: Boolean(liveStats),
                    liveSummaryFound: Boolean(liveSummary),
                    resolvedByUid: Boolean(!emailParam && resolvedUid),
                  },
                }
              : null),
          },
          { status: 200 }
        );
      }

      return Response.json(
        {
          exists: false,
          ...(debug
            ? {
                debug: {
                  projectId: activeProjectId,
                  docPath: `playerStats/${docId}`,
                  checkedUsersCollection: true,
                  resolvedByUid: Boolean(!emailParam && resolvedUid),
                },
              }
            : null),
        },
        { status: 200 }
      );
    }

    const data = doc.data() || {};
    const playCricketUrl = typeof data.playCricketUrl === "string" ? data.playCricketUrl : "";
    let liveStats: Record<string, number | string | undefined> | null = null;
    let liveSummary: Record<string, number | string | undefined> | null = null;

    if (live && playCricketUrl) {
      liveStats = await scrapeCareerStats(playCricketUrl);
      liveSummary = await scrapeSummaryStats(playCricketUrl);
      const sanitizedStats = liveStats ? stripUndefined(liveStats) : null;
      const sanitizedSummary = liveSummary ? stripUndefined(liveSummary) : null;

      if (sanitizedStats || sanitizedSummary) {
        await activeDb
          .collection("playerStats")
          .doc(docId)
          .set(
            {
              ...(sanitizedStats
                ? {
                    stats: sanitizedStats,
                    statsSource: "playcricket-live",
                    statsLastSyncedAt: new Date().toISOString(),
                  }
                : null),
              ...(sanitizedSummary
                ? {
                    summary: sanitizedSummary,
                    summarySource: "playcricket-live",
                    summaryLastSyncedAt: new Date().toISOString(),
                  }
                : null),
            },
            { merge: true }
          );
        if (sanitizedStats) {
          liveStats = sanitizedStats as Record<string, number | string | undefined>;
        }
        if (sanitizedSummary) {
          liveSummary = sanitizedSummary as Record<string, number | string | undefined>;
        }
      }
    }

    console.log("Player stats API result:", {
      email: emailParam,
      uid: resolvedUid,
      hasStats: Boolean(statsRecord),
      hasLiveStats: Boolean(liveStats),
      hasLiveSummary: Boolean(liveSummary),
      resolvedByUid: Boolean(!emailParam && resolvedUid),
    });

    return Response.json(
      {
        exists: true,
        id: doc.id,
        ...data,
        ...(liveStats ? { stats: liveStats, statsSource: "playcricket-live" } : null),
        ...(liveSummary ? { summary: liveSummary, summarySource: "playcricket-live" } : null),
        ...(debug
          ? {
              debug: {
                projectId: activeProjectId,
                docPath: `playerStats/${docId}`,
                liveRequested: live,
                liveStatsFound: Boolean(liveStats),
                liveSummaryFound: Boolean(liveSummary),
                resolvedByUid: Boolean(!emailParam && resolvedUid),
              },
            }
          : null),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching player stats record:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch player stats", details: message }, { status: 500 });
  }
}
