// Store answers in local storage to move between pages
let answers = {};
let currentQuestionIndex = 1;
const totalQuestions = 10;

// Initialize assessment
window.addEventListener('load', function() {
    updateProgressBar();
    initializeSliders();
});

// Initialize all sliders
function initializeSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateProgressBar();
            // animate and show fill
            const percent = Math.round(((this.value - 1) / 4) * 100);
            this.style.setProperty('--val', percent);
            this.classList.add('active');
            updateSliderDisplay(this);
        });
        // remove active state on change/end
        ['change', 'mouseup', 'touchend'].forEach(evt => {
            slider.addEventListener(evt, function() {
                this.classList.remove('active');
            });
        });
    });

    // Initialize notes textarea
    const notesEl = document.getElementById('user-notes');
    if (notesEl) {
        const stored = JSON.parse(localStorage.getItem('assessmentResults')) || {};
        notesEl.value = stored.notes || '';
        notesEl.addEventListener('input', function() {
            saveNote(this.value);
        });
    }
}

function saveAnswer(category, value) {
    answers[category] = value;
    localStorage.setItem('assessmentResults', JSON.stringify(answers));
}

function saveNote(value) {
    answers['notes'] = value;
    localStorage.setItem('assessmentResults', JSON.stringify(answers));
}

function updateSliderDisplay(element) {
    const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    const categoryMap = {
        'stress': ['Never', 'Sometimes', 'Often', 'Very Often', 'Always'],
        'anxiety': ['Never', 'Rarely', 'Sometimes', 'Frequently', 'Constantly'],
        'sleep': ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
        'mood': ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'],
        'social': ['Not at all', 'Limited', 'Moderate', 'Good', 'Excellent'],
        'physical': ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
        'pressure': ['None', 'Minimal', 'Moderate', 'High', 'Extreme'],
        'irritability': ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'],
        'concentration': ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly'],
        'hope': ['Very Low', 'Low', 'Neutral', 'Positive', 'Very Positive']
    };
    
    // Find the parent container to get the category
    const parentCard = element.closest('.question-card');
    const displayElement = parentCard.querySelector('.answer-display');
    
    if (displayElement) {
        const value = parseInt(element.value) - 1;
        let displayLabels = labels;
        
        // Determine which category this is
        const questionId = parentCard.id;
        const categoryIndex = parseInt(questionId.replace('q', '')) - 1;
        const categories = ['stress', 'anxiety', 'sleep', 'mood', 'social', 'physical', 'pressure', 'irritability', 'concentration', 'hope'];
        const category = categories[categoryIndex];
        
        if (categoryMap[category]) {
            displayLabels = categoryMap[category];
        }
        
        displayElement.textContent = displayLabels[value];
        displayElement.style.opacity = '1';
        // update per-question advice
        updateAdvice(category, parseInt(element.value));
    }
}

// Per-question advice system
const adviceMap = {
    'stress': {
        1: 'Great — you report very low stress. Keep routines that support balance.',
        2: 'Low stress — continue using effective strategies like breaks and prioritisation.',
        3: 'Moderate stress — try short relaxation breaks and clearer task planning.',
        4: 'High stress — consider daily brief relaxation, talk to someone, and reduce load where possible.',
        5: 'Very high stress — prioritize rest, seek support, and consider professional guidance.'
    },
    'anxiety': {
        1: 'You report minimal anxiety — good emotional regulation.',
        2: 'Low anxiety — keep using coping strategies like breathing exercises.',
        3: 'Some anxiety — practice grounding techniques and structured routines.',
        4: 'Frequent anxiety — try cognitive grounding, limit stimulants, consider therapy.',
        5: 'Persistent anxiety — reach out to a mental health professional for support.'
    },
    'sleep': {
        1: 'Very poor sleep — improve sleep hygiene, regular schedule, and reduce screens before bed.',
        2: 'Poor sleep — prioritize consistent bedtime, relaxation before sleep.',
        3: 'Average sleep — small tweaks may boost quality (light, temperature).',
        4: 'Good sleep — keep routines and environment that support rest.',
        5: 'Excellent sleep — great job maintaining healthy sleep habits.'
    },
    'mood': {
        1: 'Low mood — consider reaching out to loved ones and try small enjoyable activities.',
        2: 'Occasional low mood — track triggers and increase pleasant activities.',
        3: 'Mixed mood — maintain social contact and self-care routines.',
        4: 'Generally positive mood — keep doing what helps you feel good.',
        5: 'Persistent low mood — consider professional support and discuss symptoms with a clinician.'
    },
    'social': {
        1: 'Limited social support — try reconnecting with someone or join a group activity.',
        2: 'Some support — schedule regular check-ins with a friend.',
        3: 'Moderate support — nurture relationships with small consistent contact.',
        4: 'Good support — keep investing time in close relationships.',
        5: 'Excellent support — you have strong connections; maintain them.'
    },
    'physical': {
        1: 'Little physical activity — start with short daily walks or stretching.',
        2: 'Rare activity — build 10–20 minute routines and gradually increase.',
        3: 'Some activity — try to increase consistency for mood benefits.',
        4: 'Regular activity — great job; diversify for balance.',
        5: 'Daily activity — excellent for mental wellness; keep it up.'
    },
    'pressure': {
        1: 'No pressure — your load seems manageable.',
        2: 'Minimal pressure — maintain healthy boundaries.',
        3: 'Moderate pressure — prioritize tasks and rest.',
        4: 'High pressure — delegate, set limits, and schedule downtime.',
        5: 'Extreme pressure — consider adjusting expectations and seek support.'
    },
    'irritability': {
        1: 'Rarely irritable — good emotional regulation.',
        2: 'Occasional irritability — try short cooling-off techniques.',
        3: 'Sometimes irritable — notice triggers and build pause routines.',
        4: 'Often irritable — practice active coping and reduce stressors.',
        5: 'Constantly irritable — consider professional help to address underlying causes.'
    },
    'concentration': {
        1: 'Focus is strong — keep routines that support attention.',
        2: 'Mostly focused — use brief breaks to sustain performance.',
        3: 'Some trouble focusing — use techniques like Pomodoro and reduce distractions.',
        4: 'Frequent concentration issues — check sleep, stress, and consider structured focus training.',
        5: 'Significant concentration difficulty — evaluate with a professional; consider medical causes.'
    },
    'hope': {
        1: 'Very low hope — try goal-setting exercises and small wins to build momentum.',
        2: 'Low hope — practice gratitude and set achievable short-term goals.',
        3: 'Neutral outlook — reflect on personal values and plan small steps forward.',
        4: 'Positive outlook — continue goal-focused routines and celebrate progress.',
        5: 'Very positive — maintain optimism and support others when possible.'
    }
};

function updateAdvice(category, value) {
    const adviceEl = document.getElementById('advice-' + category);
    if (!adviceEl) return;
    const text = (adviceMap[category] && adviceMap[category][value]) ? adviceMap[category][value] : '';
    // Add brief bold title for quick action
    let title = '';
    if (['sleep','social','physical','hope'].includes(category)) {
        title = '<strong>Tip:</strong> ';
    } else {
        title = '<strong>Action:</strong> ';
    }
    adviceEl.innerHTML = text ? (title + text) : '';
}

function nextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        // Hide current question
        document.getElementById('q' + currentQuestionIndex).style.display = 'none';
        currentQuestionIndex++;
        // Show next question
        document.getElementById('q' + currentQuestionIndex).style.display = 'block';
        updateProgressBar();
        updateButtons();
        window.scrollTo(0, 0);
    } else if (currentQuestionIndex === totalQuestions) {
        // All questions answered, save to database and go to results
        saveAssessmentToDatabase();
    }
}

// Save assessment results to database (optional backend storage)
function saveAssessmentToDatabase() {
    const stored = JSON.parse(localStorage.getItem('assessmentResults')) || {};
    // Ensure all categories are present with defaults (3 = neutral)
    const payload = {
        stress: parseInt(stored.stress) || 3,
        anxiety: parseInt(stored.anxiety) || 3,
        sleep: parseInt(stored.sleep) || 3,
        mood: parseInt(stored.mood) || 3,
        social: parseInt(stored.social) || 3,
        physical: parseInt(stored.physical) || 3,
        pressure: parseInt(stored.pressure) || 3,
        irritability: parseInt(stored.irritability) || 3,
        concentration: parseInt(stored.concentration) || 3,
        hope: parseInt(stored.hope) || 3
    };

    // include optional notes
    payload.notes = stored.notes || '';

    // Send data to PHP backend
    fetch('assesment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Assessment saved to database:', result);
        // Navigate to results regardless of database save success
        window.location.href = 'result.html';
    })
    .catch(error => {
        console.log('Database save failed (will use localStorage):', error);
        // Still navigate to results if database is unavailable
        window.location.href = 'result.html';
    });
}

function previousQuestion() {
    if (currentQuestionIndex > 1) {
        document.getElementById('q' + currentQuestionIndex).style.display = 'none';
        currentQuestionIndex--;
        document.getElementById('q' + currentQuestionIndex).style.display = 'block';
        updateProgressBar();
        updateButtons();
        window.scrollTo(0, 0);
    }
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex;
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentQuestionIndex === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentQuestionIndex === totalQuestions) {
        nextBtn.textContent = 'Finish & View Results →';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Simple logic for the Results page
function calculateResult() {
    const data = JSON.parse(localStorage.getItem('assessmentResults'));
    if (!data) return;
    
    const scores = Object.values(data).map(v => parseInt(v));
    const score = scores.reduce((a, b) => a + b, 0);
    
    // Logic: 10 categories * 5 = 50 max score
    // Lower is better for stress/anxiety/mood/pressure/irritability/concentration
    // Higher is better for sleep/social/physical/hope
    // Invert the scoring for positive indicators (sleep, social, physical, hope)
    let adjustedScore = 0;
    const categoriesCalc = ['stress', 'anxiety', 'sleep', 'mood', 'social', 'physical', 'pressure', 'irritability', 'concentration', 'hope'];

    categoriesCalc.forEach((cat) => {
        const value = parseInt(data[cat]) || 3;
        if (['sleep', 'social', 'physical', 'hope'].includes(cat)) {
            // Higher is better - keep as is
            adjustedScore += value;
        } else {
            // Lower is better - invert (5->1, 1->5)
            adjustedScore += (6 - value);
        }
    });
    
    let level, message;
    if (adjustedScore >= 40) {
        level = "Excellent";
        message = "Your mental wellness appears to be in great shape. Keep up your positive habits!";
    } else if (adjustedScore >= 30) {
        level = "Good";
        message = "You're managing well overall. Consider small improvements in areas that need attention.";
    } else if (adjustedScore >= 20) {
        level = "Fair";
        message = "There are several areas that could benefit from attention. Consider reaching out for support.";
    } else {
        level = "Needs Attention";
        message = "Your mental wellness may be significantly impacted. We recommend speaking with a mental health professional.";
    }
    
    document.getElementById('score-display').innerText = adjustedScore;
    document.getElementById('level-display').innerText = level;
    document.getElementById('message-display').innerText = message;
    
    displayDetailedResults(data);
}

function displayDetailedResults(data) {
    const categories = ['stress', 'anxiety', 'sleep', 'mood', 'social', 'physical', 'pressure', 'irritability', 'concentration', 'hope'];
    const categoryNames = ['Stress Level', 'Anxiety', 'Sleep Quality', 'Mood', 'Social Support', 'Physical Activity', 'Work/Academic Pressure', 'Irritability', 'Concentration', 'Hopefulness'];
    
    let resultsHTML = '';
    categories.forEach((cat, index) => {
        const value = parseInt(data[cat]) || 3;
        resultsHTML += `<div class="result-item"><strong>${categoryNames[index]}:</strong> ${value}/5</div>`;
    });
    
    const container = document.getElementById('detailed-results');
    if (container) {
        container.innerHTML = resultsHTML;
    }
}