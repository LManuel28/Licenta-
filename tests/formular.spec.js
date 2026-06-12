// @ts-nocheck
const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

// Helper: completează pasul 1 în ordine progresivă
async function completeStep1(page, eventType = "Majorat") {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);
  await page.selectOption("#eventType", eventType);
  await page.waitForTimeout(200);
  await page.fill('input[name="Nume organizator"]', "Ion Popescu");
  await page.waitForTimeout(200);
  await page.fill('input[name="Email"]', "ion@test.ro");
  await page.waitForTimeout(200);
  await page.fill('input[name="Telefon"]', "740123456");
  await page.waitForTimeout(300);
}

// Helper: completează pasul 2
async function completeStep2(page) {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  await page.fill("#eventDate", futureDate.toISOString().split("T")[0]);
  await page.waitForTimeout(200);
  await page.fill('input[name="Ora începerii"]', "18:00");
  await page.waitForTimeout(200);
  await page.fill('input[name="Locație"]', "Restaurant Grand Palace");
  await page.waitForTimeout(200);
  await page.fill('input[name="Invitați"]', "80");
  await page.waitForTimeout(200);
  await page.fill('textarea[name="Atmosferă"]', "Energică și modernă");
  await page.waitForTimeout(300);
}

// ──────────────────────────────────────────────
// 1. PAGINA SE DESCHIDE
// ──────────────────────────────────────────────
test("pagina se deschide și are titlul corect", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/TramEvents/i);
});

// ──────────────────────────────────────────────
// 2. STRUCTURA PAGINII
// ──────────────────────────────────────────────
test("formularul și heading-ul principal există pe pagină", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await expect(page.locator("h1.main-heading")).toBeVisible();
  await expect(page.locator("#mainForm")).toBeVisible();
});

test("logo-ul TramEvents există în pagină", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator(".logo-circle")).toBeVisible();
});

// ──────────────────────────────────────────────
// 3. CÂMPURILE APAR PROGRESIV ÎN PASUL 1
// ──────────────────────────────────────────────
test("selectorul de tip eveniment este primul câmp vizibil", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);
  await expect(page.locator("#eventType")).toBeVisible();
});

test("câmpurile apar progresiv după completarea fiecăruia", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);

  await expect(page.locator("#eventType")).toBeVisible();

  await page.selectOption("#eventType", "Majorat");
  await page.waitForTimeout(300);
  await expect(page.locator('input[name="Nume organizator"]')).toBeVisible();

  await page.fill('input[name="Nume organizator"]', "Ion Popescu");
  await page.waitForTimeout(300);
  await expect(page.locator('input[name="Email"]')).toBeVisible();

  await page.fill('input[name="Email"]', "ion@test.ro");
  await page.waitForTimeout(300);
  await expect(page.locator('input[name="Telefon"]')).toBeVisible();
});

// ──────────────────────────────────────────────
// 4. TELEFONUL ACCEPTĂ DOAR CIFRE
// ──────────────────────────────────────────────
test("câmpul telefon respinge literele și acceptă doar cifre", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);
  await page.selectOption("#eventType", "Majorat");
  await page.waitForTimeout(200);
  await page.fill('input[name="Nume organizator"]', "Test User");
  await page.waitForTimeout(200);
  await page.fill('input[name="Email"]', "test@test.ro");
  await page.waitForTimeout(300);

  const phoneInput = page.locator('input[name="Telefon"]');
  await expect(phoneInput).toBeVisible({ timeout: 3000 });

  await phoneInput.fill("abc");
  await page.waitForTimeout(100);
  expect(await phoneInput.inputValue()).toBe("");

  await phoneInput.fill("740123456");
  await page.waitForTimeout(100);
  expect(await phoneInput.inputValue()).toBe("740123456");
});

test("câmpul telefon are maxlength de 9 caractere", async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);
  await page.selectOption("#eventType", "Majorat");
  await page.waitForTimeout(200);
  await page.fill('input[name="Nume organizator"]', "Test User");
  await page.waitForTimeout(200);
  await page.fill('input[name="Email"]', "test@test.ro");
  await page.waitForTimeout(300);

  const phoneInput = page.locator('input[name="Telefon"]');
  await expect(phoneInput).toBeVisible({ timeout: 3000 });
  expect(await phoneInput.getAttribute("maxlength")).toBe("9");
});

// ──────────────────────────────────────────────
// 5. DATA NU POATE FI ÎN TRECUT
// ──────────────────────────────────────────────
test("câmpul dată eveniment există și acceptă valori", async ({ page }) => {
  await completeStep1(page);
  await page.locator("#btnNext").click();
  await expect(page.locator("#eventDate")).toBeVisible({ timeout: 3000 });

  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  const futureDateStr = futureDate.toISOString().split("T")[0];
  await page.fill("#eventDate", futureDateStr);
  expect(await page.locator("#eventDate").inputValue()).toBe(futureDateStr);
});

test("câmpul dată are atributul min setat (nu permite date în trecut)", async ({
  page,
}) => {
  await completeStep1(page);
  await page.locator("#btnNext").click();
  await expect(page.locator("#eventDate")).toBeVisible({ timeout: 3000 });

  const minAttr = await page.locator("#eventDate").getAttribute("min");
  expect(minAttr).not.toBeNull();
  const minDate = new Date(minAttr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expect(minDate.getTime()).toBeGreaterThanOrEqual(today.getTime() - 86400000);
});

// ──────────────────────────────────────────────
// 6. BUTONUL NEXT
// ──────────────────────────────────────────────
test("butonul Next nu este vizibil la încărcarea paginii", async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(300);
  const isHidden = await page
    .locator("#btnNext")
    .evaluate((el) => el.classList.contains("btn-hidden"));
  expect(isHidden).toBeTruthy();
});

test("butonul Next apare doar după completarea tuturor câmpurilor din pasul 1", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.waitForTimeout(200);
  const nextBtn = page.locator("#btnNext");

  await expect(nextBtn).toBeHidden();
  await page.selectOption("#eventType", "Corporate");
  await page.waitForTimeout(200);
  await expect(nextBtn).toBeHidden();
  await page.fill('input[name="Nume organizator"]', "Test User");
  await page.waitForTimeout(200);
  await expect(nextBtn).toBeHidden();
  await page.fill('input[name="Email"]', "test@test.ro");
  await page.waitForTimeout(200);
  await expect(nextBtn).toBeHidden();
  await page.fill('input[name="Telefon"]', "740123456");
  await page.waitForTimeout(300);
  await expect(nextBtn).toBeVisible({ timeout: 3000 });
});

// ──────────────────────────────────────────────
// 7. FLUX COMPLET MAJORAT
// ──────────────────────────────────────────────
test("formularul pentru Majorat poate fi completat corect până la pasul 3", async ({
  page,
}) => {
  await completeStep1(page, "Majorat");
  const nextBtn = page.locator("#btnNext");
  await expect(nextBtn).toBeVisible({ timeout: 5000 });
  await nextBtn.click();

  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });
  await completeStep2(page);

  await expect(nextBtn).toBeVisible({ timeout: 5000 });
  await nextBtn.click();

  await expect(page.locator("#panel-4-majorat")).toBeVisible({ timeout: 5000 });
});

// ──────────────────────────────────────────────
// 8. ÎNTREBĂRILE SE SCHIMBĂ PE TIP EVENIMENT
// ──────────────────────────────────────────────
test("selectarea Nuntă afișează câmpuri specifice nuntă în pasul 2", async ({
  page,
}) => {
  await completeStep1(page, "Nuntă");
  await page.locator("#btnNext").click();
  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });
  await page.waitForTimeout(300);

  await expect(page.locator('input[name="Zona mireasă"]')).toBeVisible({
    timeout: 5000,
  });
  await expect(page.locator('input[name="Zona mire"]')).toBeVisible({
    timeout: 5000,
  });
});

test("selectarea Corporate nu afișează câmpurile de nuntă", async ({
  page,
}) => {
  await completeStep1(page, "Corporate");
  await page.locator("#btnNext").click();
  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });

  await expect(page.locator('input[name="Zona mireasă"]')).toBeHidden();
});

test("pasul 3 afișează panoul corespunzător tipului de eveniment", async ({
  page,
}) => {
  await completeStep1(page, "Corporate");
  const nextBtn = page.locator("#btnNext");
  await expect(nextBtn).toBeVisible({ timeout: 5000 });
  await nextBtn.click();

  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });
  await completeStep2(page);

  await expect(nextBtn).toBeVisible({ timeout: 5000 });
  await nextBtn.click();

  await expect(page.locator("#panel-4-corporate")).toBeVisible({
    timeout: 5000,
  });
  await expect(page.locator("#panel-4-wedding")).toBeHidden();
});

// ──────────────────────────────────────────────
// 9. STEPPER
// ──────────────────────────────────────────────
test("stepper-ul există și pasul 1 este activ la încărcare", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await expect(page.locator("#stepper")).toBeVisible();
  await expect(page.locator("#dot-1")).toHaveClass(/active/);
});

test("stepper-ul se actualizează după trecerea la pasul 2", async ({
  page,
}) => {
  await completeStep1(page, "Botez");
  await page.locator("#btnNext").click();
  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });

  await expect(page.locator("#dot-1")).toHaveClass(/done/);
  await expect(page.locator("#dot-2")).toHaveClass(/active/);
});

// ──────────────────────────────────────────────
// 10. BUTONUL BACK
// ──────────────────────────────────────────────
test("butonul Back întoarce la pasul anterior", async ({ page }) => {
  await completeStep1(page, "Aniversare");
  await page.locator("#btnNext").click();
  await expect(page.locator("#panel-2")).toBeVisible({ timeout: 3000 });

  await page.locator("#btnBack").click();
  await expect(page.locator("#panel-1")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#dot-1")).toHaveClass(/active/);
});
