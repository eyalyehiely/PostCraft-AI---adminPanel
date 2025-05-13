interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactUs = async (formData: ContactFormData): Promise<void> => {
  try {
    // Here you would typically make an API call to your backend
    // For now, we'll just simulate a successful submission
    console.log('Contact form submission:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Failed to submit contact form');
  }
};

export default contactUs; 