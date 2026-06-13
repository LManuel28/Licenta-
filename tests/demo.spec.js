// @ts-nocheck
const { test, expect } = require("@playwright/test");

const BASE_URL = "http://localhost:8080";
const PAUSE = 200;

async function fill(page, selector, value, timeout = 12000) {
  try {
    const el = page.locator(selector);
    await el.waitFor({ state: "visible", timeout });
    await el.scrollIntoViewIfNeeded();
    await el.click();
    await el.fill(value);
    await page.waitForTimeout(PAUSE);
  } catch {
    /* continua */
  }
}

async function sel(page, name, index = 1, timeout = 12000) {
  try {
    const el = page.locator(`select[name="${name}"]`);
    await el.waitFor({ state: "visible", timeout });
    await el.scrollIntoViewIfNeeded();
    await el.selectOption({ index });
    await page.waitForTimeout(PAUSE);
  } catch {
    /* continua */
  }
}

async function checkGenuri(page, containerId) {
  try {
    const genuri = page.locator(`#${containerId} .genre-card`);
    await genuri.first().waitFor({ state: "attached", timeout: 1000 });
    await genuri.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    for (let i = 0; i < 3; i++) {
      await genuri.nth(i).evaluate((el) => el.click());
      await page.waitForTimeout(200);
    }
  } catch {
    /* continua */
  }
}

async function checkGdpr(page, id) {
  try {
    const label = page
      .locator(
        `label[id="${id.replace("Check", "Label")}"], #gdprLabel4w, #gdprLabel4m, #gdprLabel`,
      )
      .first();
    await label.waitFor({ state: "visible", timeout: 5000 });
    await label.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await label.click();
    await page.waitForTimeout(PAUSE);
  } catch {
    /* continua */
  }
}

test("Demo complet TramEvents - Nunta", async ({ page }) => {
  // ── PASUL 1 ──
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  await page.selectOption("#eventType", "Nuntă");
  await page.waitForTimeout(PAUSE);

  await fill(page, 'input[name="Nume organizator"]', "Maria si Andrei Ionescu");
  await fill(page, 'input[name="Email"]', "maria.andrei@gmail.com");
  await fill(page, 'input[name="Telefon"]', "740123456");

  await expect(page.locator("#btnNext")).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(500);
  await page.locator("#btnNext").click();
  await page.waitForTimeout(800);

  // ── PASUL 2 ──
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  await fill(page, "#eventDate", futureDate.toISOString().split("T")[0]);
  await fill(page, 'input[name="Ora începerii"]', "16:00");
  await fill(
    page,
    'input[name="Locație"]',
    "Restaurant Grand Ballroom, Cluj-Napoca",
  );
  await fill(page, 'input[name="Invitați"]', "250");
  await fill(
    page,
    'textarea[name="Atmosferă"]',
    "Romantică, elegantă, cu momente speciale",
  );

  await fill(page, 'textarea[name="Persoane decedate familia mirelui"]', "Nu");
  await fill(page, 'textarea[name="Persoane decedate familia miresei"]', "Nu");
  await sel(page, "Media de vârstă", 3);

  await fill(page, 'input[name="Zona mireasă"]', "Cluj-Napoca");
  await fill(page, 'input[name="Zona mire"]', "Mureș");
  await fill(page, 'input[name="Zona părinți mireasă"]', "Cluj");
  await fill(page, 'input[name="Zona părinți mire"]', "Mureș");
  await fill(page, 'input[name="Zona nași"]', "București");

  await fill(
    page,
    'textarea[name="5 piese preferate nași"]',
    "1) Piesa unu, 2) Piesa doi, 3) Piesa trei, 4) Piesa patru, 5) Piesa cinci",
  );
  await fill(
    page,
    'textarea[name="Marșul mirilor"]',
    "A Thousand Years - Christina Perri",
  );
  await fill(
    page,
    'textarea[name="Domnișori domnișoare onoare intrare"]',
    "Nu",
  );
  await sel(page, "Moment dansul mirilor", 1);

  await fill(
    page,
    'textarea[name="Feluri mâncare și ore servire"]',
    "Aperitiv ora 17:00, Fel principal ora 20:00, Desert ora 23:00",
  );
  await fill(page, 'input[name="Ora tortului"]', "23:30");
  await fill(page, 'textarea[name="Artiști nuntă"]', "Nu");
  await fill(page, 'textarea[name="Momente artistice nuntă"]', "Nu");

  await fill(
    page,
    'textarea[name="Stiluri muzicale interzise"]',
    "Manele, trap agresiv",
  );
  await fill(
    page,
    'textarea[name="Melodii interzise sau sensibile"]',
    "Nu este cazul",
  );

  await fill(
    page,
    'textarea[name="Atmosferă elegantă sau party"]',
    "Elegantă la început, energică spre final",
  );
  await sel(page, "Gen petrecere preferat", 1);
  await fill(page, 'textarea[name="Invitați dansează populară"]', "Da, mulți");
  await fill(page, 'textarea[name="Invitați alte țări culturi"]', "Nu");
  await fill(
    page,
    'textarea[name="Interval hore sârbe tradiționale"]',
    "După primul fel",
  );

  await fill(
    page,
    'textarea[name="Cum să descrie invitații nunta"]',
    "O nuntă de vis, cu energie și momente memorabile",
  );
  await fill(
    page,
    'textarea[name="Cel mai important lucru atmosferă"]',
    "Să fie toți pe ring la dans",
  );
  await fill(
    page,
    'textarea[name="Petrecere reușită înseamnă"]',
    "Toți invitații mulțumiți și veseli",
  );
  await fill(
    page,
    'textarea[name="Nunți cu atmosferă plăcută"]',
    "Da, nunta prietenilor din 2023",
  );
  await fill(
    page,
    'textarea[name="Nunți cu atmosferă neplăcută"]',
    "Nu am fost la nunți neplăcute",
  );
  await fill(
    page,
    'textarea[name="Stres legat de petrecere"]',
    "Că ringul să fie gol",
  );
  await fill(
    page,
    'textarea[name="Ce nu vreți să se întâmple"]',
    "Muzică prea tristă sau lentă",
  );
  await fill(page, 'textarea[name="Moment cel mai așteptat"]', "Primul dans");
  await fill(
    page,
    'textarea[name="Cum vreți să vă simțiți"]',
    "Fericiți și relaxați",
  );
  await fill(page, 'textarea[name="Alte detalii nuntă"]', "-");

  // Pentru Nunta: generalMusicVibeFields si gdpr-step3 sunt ascunse de JS
  // Next apare dupa ultimul camp completat

  // Next
  await expect(page.locator("#btnNext")).toBeVisible({ timeout: 20000 });
  await page.waitForTimeout(500);
  await page.locator("#btnNext").click();
  await page.waitForTimeout(1000);

  // ── PASUL 3 — panel-4-wedding ──
  await fill(page, 'input[name="Piesa primul dans"]', "Perfect - Ed Sheeran");
  await fill(
    page,
    '#panel-4-wedding textarea[name="Top melodii mireasă"]',
    "Perfect, All of Me, Thinking Out Loud",
  );
  await fill(
    page,
    '#panel-4-wedding textarea[name="Top melodii mire"]',
    "Can't Help Falling in Love, Marry You",
  );
  await fill(page, 'textarea[name="Socrul mare"]', "-");
  await fill(page, 'textarea[name="Soacra mare"]', "-");
  await fill(page, 'textarea[name="Socrul mic"]', "-");
  await fill(page, 'textarea[name="Soacra mică"]', "-");

  // Genuri pasul 3
  await checkGenuri(page, "weddingMusicVibeFields");
  await fill(
    page,
    '#weddingMusicVibeFields textarea[name="Melodii bune"]',
    "Shape of You, Despacito, Perfect",
  );
  await fill(
    page,
    '#weddingMusicVibeFields textarea[name="Melodii de evitat"]',
    "Muzică tristă, manele lente",
  );

  // GDPR pasul 3
  try {
    await page.locator("#gdprLabel4w").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.locator("#gdprLabel4w").click();
    await page.waitForTimeout(PAUSE);
  } catch {
    /* continua */
  }

  // Submit
  try {
    const submitBtn = page.locator("#btnSubmit");
    await submitBtn.waitFor({ state: "visible", timeout: 8000 });
    await submitBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
  } catch {
    /* continua */
  }
});
