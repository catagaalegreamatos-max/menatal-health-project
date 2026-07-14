<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mental_wellness";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Set charset
$conn->set_charset("utf8");

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle POST request to save assessment results
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['stress'], $data['anxiety'], $data['sleep'], $data['mood'], $data['social'], $data['physical'], $data['pressure'], $data['irritability'], $data['concentration'], $data['hope'])) {
        echo json_encode(["success" => false, "message" => "Incomplete assessment data"]);
        exit;
    }
    
    // Calculate overall score
    $adjustedScore = 0;
    $categories = ['stress', 'anxiety', 'sleep', 'mood', 'social', 'physical', 'pressure', 'irritability', 'concentration', 'hope'];

    foreach ($categories as $cat) {
        $value = intval($data[$cat]);
        if (in_array($cat, ['sleep', 'social', 'physical', 'hope'])) {
            $adjustedScore += $value;
        } else {
            $adjustedScore += (6 - $value);
        }
    }
    
    // Determine level
    if ($adjustedScore >= 40) {
        $level = "Excellent";
    } else if ($adjustedScore >= 30) {
        $level = "Good";
    } else if ($adjustedScore >= 20) {
        $level = "Fair";
    } else {
        $level = "Needs Attention";
    }
    
    // Prepare and execute insert statement
    $stmt = $conn->prepare("INSERT INTO assessments (stress, anxiety, sleep, mood, social, physical, pressure, irritability, concentration, hope, overall_score, wellness_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
        exit;
    }
    
    // notes is optional and will be bound separately if present
    $notes = isset($data['notes']) ? $data['notes'] : '';

    $stmt = $conn->prepare("INSERT INTO assessments (stress, anxiety, sleep, mood, social, physical, pressure, irritability, concentration, hope, overall_score, wellness_level, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("iiiiiiiiiiiss", 
        $data['stress'], 
        $data['anxiety'], 
        $data['sleep'], 
        $data['mood'], 
        $data['social'], 
        $data['physical'], 
        $data['pressure'], 
        $data['irritability'],
        $data['concentration'],
        $data['hope'],
        $adjustedScore,
        $level,
        $notes
    );
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true, 
            "message" => "Assessment saved successfully",
            "assessment_id" => $stmt->insert_id,
            "overall_score" => $adjustedScore,
            "wellness_level" => $level
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
    }
    
    $stmt->close();
    
} else if ($method === 'GET') {
    // Handle GET request to retrieve assessment history
    $stmt = $conn->prepare("SELECT * FROM assessments ORDER BY created_at DESC LIMIT 10");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $assessments = [];
    while ($row = $result->fetch_assoc()) {
        $assessments[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "data" => $assessments
    ]);
    
    $stmt->close();
}

$conn->close();
?>