# GIFT parser provenance

The validator ports the relevant control paths from Moodle's GIFT importer:

- Upstream: `public/question/format/gift/format.php` on Moodle `main`
- URL: <https://raw.githubusercontent.com/moodle/moodle/main/public/question/format/gift/format.php>
- First fetched: 2026-10-07
- Reverified live: 2026-10-08
- SHA-256: `b40c1b499038bfb242d5673c6dabb45f8a756a940128ac25be9f09c423df2126`

The port covers `$CATEGORY`, `::titles::`, single-answer multiple choice, `#` feedback, and GIFT escapes.
It adds repository policy checks for ASCII, feedback wording, HTML-like delimiters, and topic category identity.
No Moodle source code is copied into this repository.
