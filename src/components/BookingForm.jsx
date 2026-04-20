import { useState, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Users, 
  Baby,
  MessageSquare,
  CreditCard,
  Check,
  Loader,
  AlertCircle,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { submitDualBooking, getWhatsAppMessage } from '../lib/bookingUtils';

const BookingForm = ({ 
  trip, 
  packages = [], 
  onSuccess, 
  onCancel,
  className = "" 
}) => {
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    travel_date: '',
    adults: 1,
    children: 0,
    special_requests: '',
    trip_title: trip?.title || '',
    trip_duration: trip?.duration || '',
    trip_price: trip?.price || 0
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const basePrice = parseFloat(formData.trip_price) || 0;
    const adults = parseInt(formData.adults) || 1;
    const children = parseInt(formData.children) || 0;
    
    // Adults full price, children 50% discount
    return (adults * basePrice) + (children * basePrice * 0.5);
  }, [formData.trip_price, formData.adults, formData.children]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.travel_date) {
      newErrors.travel_date = 'Travel date is required';
    } else if (new Date(formData.travel_date) < new Date()) {
      newErrors.travel_date = 'Travel date must be in the future';
    }
    
    const adults = parseInt(formData.adults) || 0;
    const children = parseInt(formData.children) || 0;
    
    if (adults < 1) {
      newErrors.adults = 'At least one adult is required';
    }
    if (adults > 20) {
      newErrors.adults = 'Maximum 20 adults allowed';
    }
    if (children < 0 || children > 20) {
      newErrors.children = 'Invalid number of children';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare booking data with calculated total
      const bookingDataWithTotal = {
        ...formData,
        total_price: totalPrice,
        booking_source: 'website_booking_form'
      };

      // Get WhatsApp message
      const whatsappMessage = getWhatsAppMessage(bookingDataWithTotal);
      
      // Submit booking to database and WhatsApp
      const result = await submitDualBooking(bookingDataWithTotal, whatsappMessage);

      if (result.success) {
        setSubmitStatus('success');
        
        if (onSuccess) {
          onSuccess({
            booking: result.booking,
            bookingData: bookingDataWithTotal
          });
        }
        
        // Reset form after successful submission
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          nationality: '',
          travel_date: '',
          adults: 1,
          children: 0,
          special_requests: '',
          trip_title: trip?.title || '',
          trip_duration: trip?.duration || '',
          trip_price: trip?.price || 0
        });
        setCurrentStep(1);
      } else {
        setSubmitStatus('error');
        console.error('Booking submission failed:', result.error);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1 fields before proceeding
      const step1Errors = {};
      if (!formData.full_name.trim()) step1Errors.full_name = 'Full name is required';
      if (!formData.email.trim()) step1Errors.email = 'Email is required';
      if (!formData.phone.trim()) step1Errors.phone = 'Phone is required';
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (!trip) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No trip selected for booking</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">Book Your Trip</h2>
          <div className="flex items-center space-x-4 text-blue-100">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {trip.title}
            </div>
            {trip.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {trip.duration}
              </div>
            )}
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              ${trip.price} per person
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Personal Info', icon: User },
              { step: 2, title: 'Trip Details', icon: Calendar },
              { step: 3, title: 'Review & Book', icon: Check }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {title}
                </span>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 ml-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-100 border-l-4 border-green-400 text-green-700 p-4 mx-6 mt-4 rounded">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>Booking submitted successfully! You will receive confirmation via WhatsApp and email.</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-100 border-l-4 border-red-400 text-red-700 p-4 mx-6 mt-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>There was an error processing your booking. Please try again or contact us directly.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Nationality */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your nationality</option>
                      <option value="Egyptian">Egyptian</option>
                      <option value="American">American</option>
                      <option value="British">British</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Canadian">Canadian</option>
                      <option value="Australian">Australian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Trip Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Travel Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="travel_date"
                      value={formData.travel_date}
                      onChange={handleChange}
                      min={getMinDate()}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.travel_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.travel_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.travel_date}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Adults */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.adults ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {[...Array(20)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'Adult' : 'Adults'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.adults && (
                      <p className="mt-1 text-sm text-red-600">{errors.adults}</p>
                    )}
                  </div>

                  {/* Children */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children (0-12 years)
                    </label>
                    <div className="relative">
                      <Baby className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.children ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {[...Array(21)].map((_, i) => (
                          <option key={i} value={i}>
                            {i} {i === 1 ? 'Child' : 'Children'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.children && (
                      <p className="mt-1 text-sm text-red-600">{errors.children}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows="4"
                    maxLength="500"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.special_requests.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review & Summary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Booking</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Booking Details</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{formData.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{formData.phone}</span>
                    </div>
                    {formData.nationality && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nationality:</span>
                        <span>{formData.nationality}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel Date:</span>
                      <span>{new Date(formData.travel_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travelers:</span>
                      <span>
                        {formData.adults} Adults
                        {formData.children > 0 && `, ${formData.children} Children`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Price Breakdown</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Adults ({formData.adults})
                      </span>
                      <span>${(formData.adults * formData.trip_price).toFixed(2)}</span>
                    </div>
                    
                    {formData.children > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Children ({formData.children}) - 50% off
                        </span>
                        <span>${(formData.children * formData.trip_price * 0.5).toFixed(2)}</span>
                      </div>
                    )}

                    <hr className="border-gray-300" />
                    
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  By proceeding with this booking, you agree to our terms and conditions. 
                  You will receive confirmation via WhatsApp and email with payment instructions.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Previous
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className={`px-6 py-3 text-gray-600 hover:text-gray-800 transition duration-200 ${
                    currentStep > 1 ? 'ml-3' : ''
                  }`}
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition duration-200 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Book Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;