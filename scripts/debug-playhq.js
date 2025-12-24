const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugPlayHQ() {
  let browser;
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    console.log('📄 Navigating to PlayHQ...');
    await page.goto(
      'https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder',
      { waitUntil: 'networkidle2' }
    );

    console.log('⏳ Waiting for content to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a screenshot
    const screenshotPath = path.join(__dirname, '../debug-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    // Get page content
    const content = await page.content();
    const contentPath = path.join(__dirname, '../debug-content.html');
    fs.writeFileSync(contentPath, content);
    console.log(`📝 HTML content saved: ${contentPath}`);

    // Evaluate and log table structure
    const tableInfo = await page.evaluate(() => {
      const info = {
        tables: document.querySelectorAll('table').length,
        rows: document.querySelectorAll('tbody tr').length,
        divRows: document.querySelectorAll('[role="row"]').length,
        allDivs: document.querySelectorAll('div').length,
        pageTitle: document.title,
        allText: document.body.innerText.substring(0, 2000)
      };

      // Try to find any element with "CPS" or team names
      const bodyText = document.body.innerText.toLowerCase();
      info.hasTeamData = bodyText.includes('cps') || bodyText.includes('eastern');
      
      // Look for specific structures
      const possibleTables = [];
      document.querySelectorAll('table, [role="grid"], [role="table"]').forEach((el, idx) => {
        possibleTables.push({
          index: idx,
          tag: el.tagName,
          role: el.getAttribute('role'),
          rows: el.querySelectorAll('tr, [role="row"]').length,
          classes: el.className
        });
      });
      
      info.possibleTables = possibleTables;

      // Get first 3 rows of first table if exists
      const firstTable = document.querySelector('table tbody');
      if (firstTable) {
        info.firstTableRows = [];
        const rows = firstTable.querySelectorAll('tr');
        for (let i = 0; i < Math.min(3, rows.length); i++) {
          const cells = rows[i].querySelectorAll('td');
          info.firstTableRows.push(
            Array.from(cells).map(cell => cell.textContent.trim()).slice(0, 7)
          );
        }
      }

      return info;
    });

    console.log('\n📊 TABLE STRUCTURE INFO:');
    console.log(JSON.stringify(tableInfo, null, 2));

    await page.close();
    await browser.close();

    console.log('\n✅ Debug complete! Check debug-screenshot.png and debug-content.html');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (browser) {
      await browser.close();
    }
  }
}

debugPlayHQ();
