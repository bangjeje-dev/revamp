// HubSpot Form Integration
const HUBSPOT = {
    portalId: "245789760",
    formGuid: "716b6ac2-671f-4a0a-908e-2607be5266eb"
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    
    // Create message container
    const msgContainer = document.createElement('div');
    msgContainer.id = 'form-message';
    msgContainer.className = 'hidden p-4 rounded-xl mt-6 text-sm font-medium';
    form.appendChild(msgContainer);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (submitBtn.disabled) return;

        // Reset message
        msgContainer.className = 'hidden p-4 rounded-xl mt-6 text-sm font-medium';
        msgContainer.innerText = '';

        // Gather Data
        const formData = new FormData(form);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const company = formData.get('company') || '';
        const challenge = formData.get('challenge') || '';
        
        // Handle Checkboxes
        const projectTypes = formData.getAll('project_type');
        const projectTypeString = projectTypes.join(';'); // HubSpot standard for multiple checkboxes

        // HubSpot Mapping
        const fields = [
            { name: "firstname", value: name },
            { name: "email", value: email },
            { name: "company", value: company },
            { name: "message", value: challenge },
            { name: "project_type", value: projectTypeString }
        ];

        const payload = {
            fields: fields,
            context: {
                pageUri: window.location.href,
                pageName: document.title
            }
        };

        // Loading State UX
        const originalText = btnText.innerText;
        const originalIconClass = btnIcon.className;
        
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        btnText.innerText = 'Sending...';
        btnIcon.className = 'ph ph-spinner animate-spin text-xl';

        try {
            // Note: Update to '/secure/submit' endpoint if authentication is added in the future
            const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT.portalId}/${HUBSPOT.formGuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success State
                form.reset();
                msgContainer.innerText = 'Thank you! Your inquiry has been sent successfully. We will get back to you shortly.';
                msgContainer.className = 'block p-4 rounded-xl mt-6 text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20';
            } else {
                const errorData = await response.json();
                console.error("HubSpot Submission Error:", errorData);
                throw new Error('Form submission failed.');
            }
        } catch (error) {
            // Error State
            console.error("Network Error:", error);
            msgContainer.innerText = 'Oops! Something went wrong. Please try again or contact us directly.';
            msgContainer.className = 'block p-4 rounded-xl mt-6 text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20';
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            btnText.innerText = originalText;
            btnIcon.className = originalIconClass;
        }
    });
});
