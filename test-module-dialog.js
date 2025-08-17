// Test the Course Management Dialog Functionality
// Open browser console and run this to test

console.log('Testing Course Management Module Dialog...');

// Function to test module dialog
function testModuleDialog() {
    // Check if we're on the course management page
    const isCoursePage = window.location.pathname.includes('/course-management');

    if (!isCoursePage) {
        console.log('Please navigate to a course management page first');
        console.log('Example: http://localhost:8081/teacher/course-management/1');
        return;
    }

    // Look for view details buttons
    const viewDetailsButtons = document.querySelectorAll('button:has(span:contains("View Details"))');
    console.log(`Found ${viewDetailsButtons.length} "View Details" buttons`);

    if (viewDetailsButtons.length > 0) {
        console.log('Clicking first "View Details" button...');
        viewDetailsButtons[0].click();

        // Wait for dialog to open
        setTimeout(() => {
            const dialog = document.querySelector('[role="dialog"]');
            if (dialog) {
                console.log('✅ Dialog opened successfully!');
                console.log('Dialog content:', dialog);
            } else {
                console.log('❌ Dialog did not open');
            }
        }, 500);
    } else {
        console.log('❌ No "View Details" buttons found');
    }
}

// Run the test
testModuleDialog();
