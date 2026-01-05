# 🎬📺 MeDiFlix Hub — אתר מדיה RTL ל-GitHub Pages

**גרסה:** `0.2.0`  •  **הדגמה:** [https://<user>.github.io/MeDiFlix/](https://<user>.github.io/MeDiFlix/) (החליפו ל-username שלכם)

חוויית “Netflix/YouTube” סטטית בעברית מלאה (RTL) עם חיפוש, פילטרים, מודאל נגן, “המשך צפייה”, מצב כהה/בהיר וטעינת מטא־דאטה מ-`manifest.json` או מסריקת המאגר ב-GitHub API.

---

## 🚀 התחלה מהירה
1. **שכפול והפעלה ב-GitHub Pages** — הענף `main` נפרס אוטומטית ע״י GitHub Actions (`.github/workflows/static.yml`).
2. **פתיחת האתר מקומית** — פתחו `index.html` בדפדפן (אין צורך בשרת). ודאו שקבצי `assets/` באותה תיקייה.
3. **הגדרת הקשר ריפו (לא חובה)** — באתר ב-GitHub Pages יזוהה אוטומטית `<owner>.github.io/<repo>`. בדומיין מותאם ניתן להגדיר ב-`<body data-repo-owner="..." data-repo-name="...">`.

---

## 🧩 פיצ׳רים עיקריים
- 🔍 חיפוש, מיון (חדש/ישן, א→ת) וסינון לפי סוג (וידאו/אודיו/PDF).
- ▶️ "המשך צפייה" עם שמירת התקדמות ב-`localStorage`.
- 🆕 "נוסף לאחרונה" לפי חותמת זמן (`mtime`).
- 🌙☀️ מצב כהה/בהיר + תמיכה מלאה ב-RTL.
- 🖼️ תמונות ממוזערות, תגיות, קטגוריות לפי נתיב תיקייה.
- 📚 PDF Viewer מובנה + קישור להורדה.
- 🤖 **סריקה אוטומטית של המאגר** (GitHub API) גם בלי manifest.json — מזהה קבצי וידאו/אודיו/PDF חדשים.
- 🏷️ תגית גרסה דינמית מתוך `VERSION`.

---

## 📥 איך מוסיפים קבצי מדיה חדשים
1. גררו וידאו/אודיו/PDF לתיקיית `media/` או לשורש המאגר.
2. (אופציונלי) הוסיפו תמונה תואמת ל-`media/thumbs/` בשם זהה לקובץ.
3. פרסמו את השינויים. לאחר הפריסה לחצו באתר על **♻️ רענון** — הסורק יזהה את הקבצים אוטומטית.
4. רוצים שליטה מלאה במטא־דאטה? עדכנו את `manifest.json` בהתאם לפורמט `media_manifest_v1`.

> טיפ: הסורק האוטומטי עושה שימוש ב-GitHub API. עבור ביצועים צפויים בכל טעינה, שמרו manifest.json מעודכן (אפשר גם לייצר אותו ב-GitHub Action עתידי).

---

## 🔗 קישורים שימושיים
- דף הבית: [`index.html`](./index.html)
- עיצוב: [`assets/styles.css`](./assets/styles.css)
- לוגיקה: [`assets/app.js`](./assets/app.js)
- גרסה נוכחית: [`VERSION`](./VERSION)
- Manifest פעיל: [`manifest.json`](./manifest.json)
- יומן גרסאות: [`CHANGELOG.md`](./CHANGELOG.md)
- מפת דרכים: [`ROADMAP.md`](./ROADMAP.md)
- תמיכה: [`SUPPORT.md`](./SUPPORT.md)

---

## 📚 מדריך קצר ל-manifest.json
- מיקום: שורש המאגר (`./manifest.json`).
- שדות עיקריים: `type` (`video`/`audio`/`pdf`), `path`, `url`, `title`, `description`, `tags`, `thumb`, `mtime` (שניות Unix).
- דוגמה קיימת כוללת שני קובצי PDF שהועלו: [`Nishmat.pdf`](./Nishmat.pdf) ו-[`הבמאי_שבפנים_סודות_יצר_הרע.pdf`](./%D7%94%D7%91%D7%9E%D7%90%D7%99_%D7%A9%D7%91%D7%A4%D7%A0%D7%99%D7%9D_%D7%A1%D7%95%D7%93%D7%95%D7%AA_%D7%99%D7%A6%D7%A8_%D7%94%D7%A8%D7%A2.pdf).

אם manifest חסר או ריק, האתר יפעיל סריקה אוטומטית של המאגר (עד עומק תיקיות 3) וייצור קלפים על בסיס הנתיב והשם.

---

## 🧱 תשתית תיעוד בעברית
- רישיון: [`LICENSE`](./LICENSE)
- תרומות: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- קוד התנהגות: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- אבטחה: [`SECURITY.md`](./SECURITY.md)
- תמיכה: [`SUPPORT.md`](./SUPPORT.md)
- מפת דרכים: [`ROADMAP.md`](./ROADMAP.md)
- ממשל: [`GOVERNANCE.md`](./GOVERNANCE.md)
- בעלויות קוד: [`CODEOWNERS`](./CODEOWNERS)
- ציטוט אקדמי: [`CITATION.cff`](./CITATION.cff)
- מחברים: [`AUTHORS.md`](./AUTHORS.md)
- הוקרות: [`ACKNOWLEDGEMENTS.md`](./ACKNOWLEDGEMENTS.md)
- שחרורים: [`RELEASING.md`](./RELEASING.md)

---

## 🧪 בדיקות ידניות מוצעות
- פתיחת `index.html` ובדיקת מצב כהה/בהיר.
- הוספת קובץ PDF/וידאו לדוגמה ובדיקת זיהוי בסריקה האוטומטית (כפתור רענון).
- אימות חיפוש/מיון ופתיחת מודאל כולל המשך צפייה.

---

## 🕯️ ציטוט השראה
**"וְכָל מַעֲשֶׂיךָ יִהְיוּ לְשֵׁם שָׁמָיִם"** (אבות ב׳, י״ב)
