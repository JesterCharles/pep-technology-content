# Modules, imports and virtual environments

## Objectives

- Import from the standard library and from your own module with import and from ... import, and explain how Python finds the module
- Create and activate a virtual environment with python -m venv on macOS, Linux and Windows, and install a pinned package into it with python -m pip
- Record and reinstall dependencies with a requirements file, and explain why the virtual environment folder is git-ignored rather than committed

## Teaching

### Start with a guess

Practice prediction, not scored. In Java you import classes from packages. In Python, every `.py` file is a module you can import.

### One project, one virtual environment

A virtual environment is a folder, usually `.venv`, with its own Python and its own installed packages, so projects do not share or clash.

- Create: `python3 -m venv .venv` (Windows: `py -m venv .venv`).
- Activate on POSIX shells: `source .venv/bin/activate`. On Windows use `.venv\Scripts\activate.bat` in `cmd.exe`, or `.venv\Scripts\Activate.ps1` in PowerShell. The prompt gains `(.venv)`, and `python` now means the venv's Python.
- Install a pinned version: `python -m pip install pytest==9.1.1`, or every pin in a file with `-r requirements.txt`.

`python -m pip` runs the pip that belongs to the active Python.

### How Python finds a module

`import json` loads a module; `from pricing import total` pulls one name out of it. The module name is the file name without `.py`.

Python searches the entries in `sys.path` in order. The entries depend on how Python starts, environment settings such as `PYTHONPATH`, and site configuration. In the normal script case shown here, the script folder, standard-library locations and the running Python's `site-packages` are among those entries. That last location is why `pytest` imports only when the venv's Python runs. If no entry has it, you get `ModuleNotFoundError`.

### Commit the recipe, not the environment

Record what the project needs in `requirements.txt`, one pin per line such as `pytest==9.1.1`. `python -m pip freeze > requirements.txt` writes the installed packages in requirements format, one `name==version` line each. By default it leaves out bootstrap tools such as pip itself (`--all` includes them), and it records what is installed: it is not a lockfile.

A teammate installs the same pinned versions in their own venv: create, activate, then `python -m pip install -r requirements.txt`.

Do not commit `.venv`: it is large, tied to one machine's Python and paths, and meant to be deleted and recreated. Add `.venv/` to `.gitignore` (since Python 3.13, venv also writes its own ignore file inside the folder).

## Model

Sam's fictional project folder. The terminal and imports are simulations of real Python 3 behaviour.

pricing.py

```
def total(prices):
    return sum(prices)
```

app.py (same folder)

```
# which import line?
print(total([2, 3]))
```

- **Folder**: /home/sam/shop
- **Files**: app.py pricing.py requirements.txt
- **Active environment**: none: system python3
- **Installed in .venv**: no .venv yet
- **requirements.txt**: pytest==9.1.1

Normal script example (sys.path is ordered; its entries depend on startup mode, environment and site configuration):

|  |  |  |
| --- | --- | --- |
| 1 | /home/sam/shop | the script's folder |
| 2 | /usr/lib/python3.14 | standard library |
| 3 | /usr/lib/python3/dist-packages | site-packages of the system python3 |

requirements.txt (commit)

```
iniconfig==2.3.1
packaging==26.3
pluggy==1.7.0
Pygments==2.21.0
pytest==9.1.1
```

.gitignore (commit)

```
.venv/
```

| Step | macOS / Linux | Windows |
| --- | --- | --- |
| Create | python3 -m venv .venv | py -m venv .venv |
| Activate | source .venv/bin/activate | cmd.exe: .venv\Scripts\activate.bat PowerShell: .venv\Scripts\Activate.ps1 |
| Install | python -m pip install -r requirements.txt |  |

## Recap

- A module is a `.py` file; import it by name without `.py`.
- Python searches `sys.path` in order; startup mode, environment and site configuration determine its entries.
- One venv per project: create, activate, then `python -m pip install` pinned versions.
- Commit `requirements.txt`; ignore `.venv/`.

Next topic: Exceptions and logging

## Cheat sheet

Each restaurant in a food hall has its own kitchen with its own pantry, so one chef's favourite flour never replaces another chef's. When a restaurant opens a second site, nobody trucks the stocked pantry across town. The chef sends a short shopping list with exact brands and sizes, the new kitchen restocks from it in an afternoon, and that list is what goes into the shared recipe binder.

A virtual environment is one project's pantry; the pinned requirements file is the shopping list you share, never the stocked pantry itself.

Use these same observable steps when working from the text alternative.

1. Where to look: Read the code in the workspace on the right (below these steps on a narrow screen).
2. What to do or type: Under Prediction, pick the result you expect.
3. What to expect: Pick Low, Medium or High confidence, then press Check my prediction.
4. How to know it's done: Feedback appears below and Continue shows. A wrong guess is fine: the feedback explains it and you still move on.

1. Where to look: Click the terminal's input line (or Tab to it), type one command at a time, and press Enter after each command.
2. What to do or type: Create the venv with `python3 -m venv .venv`, then activate it with `source .venv/bin/activate`; the prompt then starts with `(.venv)`.
3. What to expect: Install with `python -m pip install -r requirements.txt`, then run `python -m pip --version` and look for `.venv` in the path it prints.
4. How to know it's done: After the first install, run `python -m pip freeze > requirements.txt`, inspect it with `cat requirements.txt`, then reinstall with `python -m pip install -r requirements.txt`. Every check reads done.

1. Where to look: In Run an import, pick which Python runs `app.py`.
2. What to do or type: Press one of the `import` buttons.
3. What to expect: The output box shows where Python found the module, or a `ModuleNotFoundError`. Try each import with both Pythons.
4. How to know it's done: Each check above changes from open to done when a run shows it. Continue appears when every check is done.

1. Where to look: Read the question and the code it names in the workspace on the right.
2. What to do or type: Pick one answer, pick your confidence, then press Check answer.
3. What to expect: Feedback appears below. If the first answer is not right, a second question appears; answer it and press Check second try.
4. How to know it's done: Either way, Continue then shows and takes you to the recap.

|  |  |
| --- | --- |
| `import json` / `from pricing import total` | import a module / one name |
| `python3 -m venv .venv` | create (Windows: `py -m venv .venv`) |
| `source .venv/bin/activate` | activate on POSIX shells |
| `.venv\Scripts\activate.bat` / `.venv\Scripts\Activate.ps1` | activate in Windows cmd.exe / PowerShell |
| `python -m pip install pytest==9.1.1` | install a pinned version |
| `python -m pip freeze > requirements.txt` | record exact versions |
| `python -m pip install -r requirements.txt` | reinstall them |
| `deactivate` | leave the venv |

## Sources

Checked against these live official pages on 2026-10-13. The practice terminal simulates bash on Linux; its pip output is shortened from a real run of python -m pip install -r requirements.txt with pytest==9.1.1, then pip freeze and a reinstall, on CPython 3.14 and pip 26.1.2 on 2026-10-15. Dependency versions are what pip resolved that day; a later install may resolve newer ones, which is why freeze records them.

- Python tutorial: Modules
- Python tutorial: Virtual environments and packages
- venv: Creation of virtual environments
- Language reference: The import system
- Python Packaging User Guide: Install packages in a virtual environment using pip and venv
- pip documentation: pip freeze

## Static interaction alternatives

### predict

Prediction (practice, not scored): pricing.py defines total(prices); app.py in the same folder calls total([2, 3]). Which import line works? Options: from pricing import total; import pricing.py; import total from pricing; #include "pricing.py". Answer: from pricing import total. The module name is the file name without .py. import pricing.py fails with ModuleNotFoundError: No module named 'pricing.py'; 'pricing' is not a package. import total from pricing is JavaScript order and a SyntaxError in Python, and # starts a comment.

### terminal

Terminal activity in /home/sam/shop, which holds app.py, pricing.py and requirements.txt, which starts with one line, pytest==9.1.1. Worked example: python3 -m venv .venv creates the .venv folder and prints nothing. source .venv/bin/activate activates it; the prompt starts with (.venv). python -m pip install -r requirements.txt installs pytest 9.1.1 and the dependencies pip resolves for it; on 2026-10-15 it ended with Successfully installed iniconfig-2.3.1 packaging-26.3 pluggy-1.7.0 pygments-2.21.0 pytest-9.1.1, and a later install may resolve newer dependency versions. python -m pip --version then reports pip 26.1.2 from /home/sam/shop/.venv/lib/python3.14/site-packages/pip (python 3.14). python -m pip freeze > requirements.txt prints nothing and replaces the file with the installed packages in requirements format, each at its exact version (pip itself is left out by default): iniconfig==2.3.1, packaging==26.3, pluggy==1.7.0, Pygments==2.21.0 and pytest==9.1.1; cat requirements.txt shows those five lines. Reinstalling with python -m pip install -r requirements.txt then reads all five pins and reports each as Requirement already satisfied, because the venv already has exactly those versions. Before activation, installing with the system Python on this Debian-style system fails with error: externally-managed-environment. Windows uses py -m venv .venv, then .venv\Scripts\activate.bat in cmd.exe or .venv\Scripts\Activate.ps1 in PowerShell.

### explore

Import activity for /home/sam/shop/app.py. Python searches sys.path in order: the script's folder (/home/sam/shop), the standard library, then the site-packages of the running Python. import json is found in the standard library with either Python. from pricing import total is found in /home/sam/shop as pricing.py. import pytest is found in /home/sam/shop/.venv/lib/python3.14/site-packages when the venv's Python runs, and fails with ModuleNotFoundError: No module named 'pytest' under the system python3, which has no pytest installed. import requests fails with ModuleNotFoundError: No module named 'requests' under both, because it was never installed.

### mcq

Apply question: what should the repository contain so a teammate can run the project? Options: the .venv folder (no: large, tied to Sam's machine and paths, and not portable); requirements.txt with pinned versions and .venv/ listed in .gitignore (correct); nothing about packages (the teammate would have to guess versions); a zip of site-packages (the same problem as committing the venv). Retry: the teammate runs python3 -m venv .venv, activates it, then python -m pip install -r requirements.txt. pip freeze writes requirements, it does not install them; copying a venv between machines is not supported; python3 requirements.txt tries to run the text file as a script.
