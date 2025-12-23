#!/usr/bin/env node

/**
 * Manual script to refresh PlayHQ data
 * Run: node scripts/refresh-playhq.js
 */

const fs = require('fs');
const path = require('path');

async function refreshData() {
  console.log('🏏 Starting PlayHQ data refresh...');
  
  try {
    // Call the API endpoint
    const response = await fetch('http://localhost:3000/api/scrape-playhq');
    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success! Data updated from PlayHQ');
      console.log(`Last updated: ${data.data.lastUpdated}`);
      console.log(`Teams in standings: ${data.data.standings.length}`);
      data.data.standings.forEach((team, idx) => {
        console.log(`  ${idx + 1}. ${team.team} - ${team.points} points`);
      });
    } else {
      console.log('❌ Error:', data.error);
      if (data.details) {
        console.log('Details:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ Failed to refresh data:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on localhost:3000');
  }
}

refreshData();
