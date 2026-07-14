// Lightweight assessment helper for the older short-assessment page
const assessmentData = {
    mood: 0,
    stress: 0
};

function submitAssessment() {
    const moodEl = document.getElementById('moodRange');
    const stressEl = document.getElementById('stressRange');
    assessmentData.mood = moodEl ? moodEl.value : 0;
    assessmentData.stress = stressEl ? stressEl.value : 0;

    localStorage.setItem('userResults', JSON.stringify(assessmentData));
    window.location.href = 'results.html';
}

function saveQuickAssessment() {
    const mood = document.getElementById('moodRange')?.value || 5;
    const stress = document.getElementById('stressRange')?.value || 5;
    localStorage.setItem('userResults', JSON.stringify({ mood, stress }));
    return { mood, stress };
}
