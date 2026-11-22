const yearLabels = document.querySelectorAll('.current-year');
for (const label of yearLabels) {
  label.textContent = new Date().getFullYear();
}

const checklist = document.querySelector('.checklist');

if (checklist) {
    const boxes = checklist.querySelectorAll('input[type="checkbox"]');
    const count = checklist.querySelector('.checklist-count');
    const progress = checklist.querySelector('progress');
    const saveNote = checklist.querySelector('.save-note');
    const resetButton = checklist.querySelector('.reset-checklist');
    const storageKey = 'umsi-elo-checklist-' + checklist.dataset.stage;
    let canSave = true;

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (Array.isArray(saved)) {
            for (const box of boxes) {
                box.checked = saved.includes(box.value);
            }
        }
    } catch {
        canSave = false;
    }

    function updateProgress(save) {
        const completed = [];
        for (const box of boxes) {
            if (box.checked) completed.push(box.value);
        }

        progress.value = completed.length;
        count.textContent = completed.length + ' of ' + boxes.length + ' complete';
        if (completed.length === boxes.length) {
            count.textContent += '. All set for this stage!';
        }

        if (save && canSave) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(completed));
            } catch {
                canSave = false;
            }
        }

        saveNote.textContent = canSave
            ? 'Saved in this browser. Reset when you start a new project.'
            : 'Progress works for this visit, but cannot be saved in this browser.';
    }

    for (const box of boxes) {
        box.addEventListener('change', function () {
            updateProgress(true);
        });
    }

    resetButton.addEventListener('click', function () {
        for (const box of boxes) box.checked = false;
        updateProgress(true);
    });

    updateProgress(true);
    count.hidden = false;
    progress.hidden = false;
    saveNote.hidden = false;
    resetButton.hidden = false;
}
