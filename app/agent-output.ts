

// Items
const Items = {
    // Rule id
    // Validation rule - VR-xxx
    // Compliance rule - CR-xxx
    // Any other rule - use AI-xxx
    "id":  "VR-001",
    // Rule name
    "name":  "Validate Resource Name",
    // Rule Type: Validation, 
    // VR, CR, FR
    "type":  "VR",

    // Text describing the findings and issue    
    "findings": "Resource name does not conform to naming standards.",

    // 

    // Location of the item on the proof
    "location": {
        // page number
        "page":  1,
        // text: if its a text item
        "text":  "Address of company",
        // bbox [x, y, width, height] from top left corner
        "bbox":  [100, 150, 200, 50]        
    },

    // Status: PASSED, FAILED, NOT_APPLICABLE
    "status":  "FAILED",

    // Severity: LOW, MEDIUM, HIGH
    "severity":  "HIGH",

    // Recommendation to fix the issue
    // Will be used to place annotated comment on the proof
    "recommendation":  "Ensure the resource name follows the specified naming conventions.",

    // Discuss with AI
    // Text to discuss the found issue further with AI
    // Inlcude location and findings, context if needed
    "discuss_with_ai":  "The resource name 'XYZ_123' does not conform to the naming standards outlined in the documentation. It is located on page 1, in the text 'Address of company', with a bounding box of [100, 150, 200, 50]. The finding states that the resource name does not conform to naming standards.",

    // Explain the thought process
    // Which rules were applied, why it was marked as failed
    // What data was used to make the decision
    // Debug information
    "debug":  "The resource name 'XYZ_123' was evaluated against the naming conventions outlined in the documentation. It was found to contain invalid characters and did not meet the length requirements specified."

}

// Results object structure
const AgentResult = {
    // Overall status: PASSED, FAILED, NOT_APPLICABLE
    "status":  "FAILED",
    
    // Overall severity: LOW, MEDIUM, HIGH
    "severity":  "HIGH",

    "agent": {
        // Agent name
        "name":  "ComplianceCheckerAI",
        // Agent version
        "version":  "1.0.0"
        // Model and other info for logging
        
    },

    // Timestamp of the result generation
    "timestamp":  "2024-10-01T12:00:00Z",



    // Array of items
    "items":  [Items]
}