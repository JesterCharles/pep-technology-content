---
title: Python Virtual Environments - Full Tutorial for Beginners
channel: Tech With Tim
url: https://www.youtube.com/watch?v=Y21OR1OPC9A
runtimeMinutes: 9.1
embeddable: true
checkedAt: 2026-10-14
covers:
  - Why each project needs its own isolated set of packages (0:00 to 0:40)
  - Creating a venv with python -m venv on Windows and python3 -m venv on macOS and Linux (0:40 to 2:03)
  - "Activating it: the Scripts activate script on Windows, source bin/activate on macOS and Linux, the prompt prefix, and deactivate (2:03 to 3:04)"
  - pip list inside and outside the environment, and installing a package into it (3:04 to 4:26)
  - pip freeze > requirements.txt, then a fresh venv and pip install -r requirements.txt (4:26 to 7:07)
  - Keeping the venv folder beside the code, keeping your own code out of it, and deleting it when done (7:07 to 8:48)
gaps:
  - o1 is not covered; no import, from ... import or module search path
  - o2 is covered, but packages are installed with pip rather than python -m pip, and no version is pinned at install time
  - o3 is partly covered; requirements.txt is created and reinstalled, but the video does not say to git-ignore the venv folder
cautions:
  - Third-party educator channel (Tech With Tim), published 2024-03-16
  - The description carries DataCamp affiliate links, and the closing promotes the presenter's paid course
  - It runs plain pip and pip3; this topic uses python -m pip so the active interpreter's pip is used
  - The captions say "pip install request"; the package on PyPI is requests
  - pip freeze records the installed packages in requirements format, including dependencies, not only the ones installed by name; by default it leaves out bootstrap tools such as pip, and its output is not a lockfile
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: What are Python modules? (Bro Code)
    url: https://www.youtube.com/watch?v=XcfxkHrHTVE
    reason: "6:35 (395 s). import x, import x as y, from x import y and creating your own module, per its description chapters (o1); captions not reviewed"
rejected:
  - title: Virtual Environments | Python for Beginners [34 of 44] (Microsoft Developer)
    url: https://www.youtube.com/watch?v=_eczHOiFMZA
    reason: "5:55 (355 s), 2019. Its captions say to install virtualenv globally with pip and to use virtualenv on macOS and Linux; current practice is the built-in python -m venv on every platform"
  - title: "Python Deep Dive: Modules, Packages & Virtual Environments Explained (Code with Gunnar)"
    url: https://www.youtube.com/watch?v=4SQFQCqcZ_w
    reason: "11:32 (692 s). Best topical fit (imports, the standard library, venv, pip), but YouTube reports playableInEmbed false, so it is not embeddable"
  - title: "Python Tutorial: VENV (Mac & Linux) - How to Use Virtual Environments with the Built-In venv Module (Corey Schafer)"
    url: https://www.youtube.com/watch?v=Kg1Yvry_Ydk
    reason: 14:17 (857 s) exceeds the 12-minute topic budget
  - title: "Python Tutorial: VENV (Windows) - How to Use Virtual Environments with the Built-In venv Module (Corey Schafer)"
    url: https://www.youtube.com/watch?v=APOPm01BVrk
    reason: 17:10 exceeds the 12-minute topic budget
---

# Video: Python Virtual Environments - Full Tutorial for Beginners

Tech With Tim, 9:05 (545 s), https://www.youtube.com/watch?v=Y21OR1OPC9A.
Live, public and embeddable on 2026-10-14 (playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions, the video opens with the problem: projects that share globally installed packages clash over versions, and a virtual environment gives each project its own isolated set (0:00 to 0:40).

- **Creating a venv** (0:40 to 2:03): it is created with the built-in `venv` module, `python -m venv env` on Windows or `python3 -m venv env` on macOS and Linux. This makes a new folder in the project directory.
- **Activating it** (2:03 to 3:04): on Windows, run the `Scripts\activate` script; on macOS and Linux, run `source env/bin/activate`. The prompt then starts with the environment name, and `deactivate` leaves it.
- **Installing into it** (3:04 to 4:26): inside the environment, `pip list` shows only pip and setuptools. A package installed there appears only in that environment, not in the global list.
- **Sharing the dependencies** (4:26 to 7:07): `pip freeze > requirements.txt` saves the installed packages with their versions in requirements format. Someone else creates and activates a fresh environment, then runs `pip install -r requirements.txt` to get the same packages.
- **Tips** (7:07 to 8:48): keep the environment folder (`env` or `venv`) beside your code, never put your own code inside it, and delete the folder when it is no longer needed.

It matches objective o2 and most of o3.

## Gaps against the objectives

- o1: not covered. The video has no `import`, no `from ... import`, and nothing on how Python finds a module.
- o2: covered, with one difference: packages are installed with plain `pip`, not `python -m pip`, and no version is pinned at install time.
- o3: partly covered. Recording to and reinstalling from `requirements.txt` are shown, but the video does not say to add the environment folder to `.gitignore`.

## Alternates

- Bro Code, "What are Python modules?", https://www.youtube.com/watch?v=XcfxkHrHTVE, 6:35 (395 s). `import x`, `import x as y`, `from x import y` and creating your own module (o1).

## Rejected

- Microsoft Developer, "Virtual Environments | Python for Beginners [34 of 44]", https://www.youtube.com/watch?v=_eczHOiFMZA: its 2019 advice installs `virtualenv` globally and uses it on macOS and Linux, not the built-in `python -m venv`.
- Code with Gunnar, "Python Deep Dive: Modules, Packages & Virtual Environments Explained", https://www.youtube.com/watch?v=4SQFQCqcZ_w: not embeddable (playableInEmbed false).
- Corey Schafer, "Python Tutorial: VENV (Mac & Linux)", https://www.youtube.com/watch?v=Kg1Yvry_Ydk: 14:17 exceeds the 12-minute topic budget.
- Corey Schafer, "Python Tutorial: VENV (Windows)", https://www.youtube.com/watch?v=APOPm01BVrk: 17:10 exceeds the 12-minute topic budget.
