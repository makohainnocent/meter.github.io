<?php
// Include the file with database functions
require_once 'Database.php';

// Connect to the database
$conn = connectToDatabase();
// Assuming you already have the connection available in the variable $conn

// Function to sanitize input data
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if UserName is present
if (isset($_GET['UserName'])) {
    // Sanitize the input parameter
    $userName = sanitize($_GET['UserName']);

    // Prepare the SQL statement
    $sql = "SELECT * FROM system WHERE UserName = ?";

    // Prepare the statement
    if ($stmt = $conn->prepare($sql)) {
        // Bind the parameter to the prepared statement
        $stmt->bind_param("s", $userName);

        // Execute the statement
        if ($stmt->execute()) {
            // Get the result set
            $result = $stmt->get_result();

            // Fetch the data as an associative array
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            if (!empty($data)) {
                // Convert the data to JSON format
                $jsonData = json_encode($data);

                // Output the JSON data
                header('Content-Type: application/json');
                echo $jsonData;
            } else {
                echo "Error: No records found for the provided UserName.";
            }
        } else {
            echo "Error: Failed to fetch the data.";
        }

        // Close the statement and result set
        $stmt->close();
        $result->close();
    } else {
        echo "Error: Failed to prepare the SQL statement.";
    }
} else {
    echo "Error: Missing required parameter.";
}

// Close the database connection (if necessary)
closeDatabaseConnection($conn);
?>
