import { admin, db } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const FALLBACK_PLAYCRICKET_URLS: Record<string, string> = {
  "ravip.2006@gmail.com": "https://play.cricket.com.au/player/90918ca4-b93a-4d46-9f0c-000135fee349/ravi-prakash?tab=career",
};

let puppeteerLib: any;

async function getPuppeteer() {
  if (!puppeteerLib) {
    puppeteerLib = (await import("puppeteer")).default;
  }
  return puppeteerLib;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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
  let browser: any = null;
  try {
    const puppeteer = await getPuppeteer();
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setDefaultNavigationTimeout(30000);

    await page.goto(normalizePlayCricketUrl(playCricketUrl), { waitUntil: "networkidle2" });
    await page.waitForSelector("section, body", { timeout: 12000 });
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const bodyText = await page.evaluate(() => document.body?.innerText || "");
    const parsed = parseCareerStatsFromText(bodyText);

    await page.close().catch(() => {});
    return parsed;
  } catch (error) {
    console.warn("Failed to scrape PlayCricket career stats:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

async function scrapeSummaryStats(playCricketUrl: string) {
  let browser: any = null;
  try {
    const puppeteer = await getPuppeteer();
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setDefaultNavigationTimeout(30000);

    await page.goto(normalizePlayCricketSummaryUrl(playCricketUrl), { waitUntil: "networkidle2" });
    await page.waitForSelector("section, body", { timeout: 12000 });
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const bodyText = await page.evaluate(() => document.body?.innerText || "");
    const parsed = parseSummaryStatsFromText(bodyText);

    await page.close().catch(() => {});
    return parsed;
  } catch (error) {
    console.warn("Failed to scrape PlayCricket summary stats:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
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
    const debug = url.searchParams.get("debug") === "1";
    const live = url.searchParams.get("live") === "1";

    if (!emailParam) {
      return Response.json({ error: "Missing email parameter" }, { status: 400 });
    }

    if (!db) {
      return Response.json({ error: "Database not available" }, { status: 503 });
    }

    const docId = normalizeEmail(emailParam);
    const doc = await db.collection("playerStats").doc(docId).get();

    if (!doc.exists) {
      const fallbackUrl = FALLBACK_PLAYCRICKET_URLS[docId];

      if (fallbackUrl) {
        let liveStats: Record<string, number | string | undefined> | null = null;
        let liveSummary: Record<string, number | string | undefined> | null = null;
        if (live) {
          liveStats = await scrapeCareerStats(fallbackUrl);
          liveSummary = await scrapeSummaryStats(fallbackUrl);
        }

        const sanitizedStats = liveStats ? stripUndefined(liveStats) : null;
        const sanitizedSummary = liveSummary ? stripUndefined(liveSummary) : null;

        await db
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
            email: docId,
            playCricketUrl: fallbackUrl,
            ...(sanitizedStats ? { stats: sanitizedStats, statsSource: "playcricket-live" } : null),
            ...(sanitizedSummary ? { summary: sanitizedSummary, summarySource: "playcricket-live" } : null),
            ...(debug
              ? {
                  debug: {
                    projectId: (admin.app()?.options as any)?.projectId,
                    docPath: `playerStats/${docId}`,
                    usedFallbackUrl: true,
                    liveRequested: live,
                    liveStatsFound: Boolean(liveStats),
                    liveSummaryFound: Boolean(liveSummary),
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
                  projectId: (admin.app()?.options as any)?.projectId,
                  docPath: `playerStats/${docId}`,
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
        await db
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
                projectId: (admin.app()?.options as any)?.projectId,
                docPath: `playerStats/${docId}`,
                liveRequested: live,
                liveStatsFound: Boolean(liveStats),
                liveSummaryFound: Boolean(liveSummary),
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
