import React, { useState, useRef, useEffect } from 'react';
// import '../../assets/css/fonts.css'
import { Container, Row, Col, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,


  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaGlobe,
  FaChartLine,
  FaAd,
  FaPenFancy,
  FaMobileAlt
} from 'react-icons/fa';
// import '../../assets/css/main.css'
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutPage from './CheckoutPage';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Type definitions
interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
}

// type CountryCode = {
//   code: string;
//   country: string;
// };

type FormData = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  message: string;
};

// Custom styles based on provided CSS variables
const styles = {
  primaryColor: '#4E2FDA', // --ztc-bg-bg-1
  primaryLight: '#EDE9F8', // --ztc-bg-bg-2
  secondaryColor: '#6455E1', // --ztc-bg-bg-28
  textDark: '#090B0E', // --ztc-text-text-2
  textMedium: '#3D4C5E', // --ztc-text-text-3
  textAccent: '#4E2FDA', // --ztc-text-text-4
  gradient: 'linear-gradient(90deg, #4E2FDA 0%, #6455E1 100%)',
  bgLight: '#F6F8F9', // --ztc-bg-bg-15
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const stepTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20
};

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingSection: React.FC = () => {
  // Initial state values
  const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    message: ''
  };

  // Add these to your existing state declarations
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // For calendar
  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = useState<number>(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState<number>(currentDate.getFullYear());

  // For animations
  const sectionRef = useRef<HTMLElement>(null);

  // Available services
  const services: Service[] = [
    {
      id: 1,
      title: 'SEO Optimization',
      description: 'Improve your website ranking and organic traffic',
      icon: <FaSearch className="fs-3" />,
      price: '500.00'
    },
    {
      id: 2,
      title: 'Website Development',
      description: 'Custom website design and development',
      icon: <FaGlobe className="fs-3" />,
      price: '1200.00'
    },
    {
      id: 3,
      title: 'Social Media Marketing',
      description: 'Grow your brand presence across platforms',
      icon: <FaAd className="fs-3" />,
      price: '800.00'
    },
    {
      id: 4,
      title: 'Content Marketing',
      description: 'Strategic content creation and distribution',
      icon: <FaPenFancy className="fs-3" />,
      price: '600.00'
    },
    {
      id: 5,
      title: 'PPC Advertising',
      description: 'Targeted paid campaigns for quick results',
      icon: <FaChartLine className="fs-3" />,
      price: '1000.00'
    },
    {
      id: 6,
      title: 'Mobile App Marketing',
      description: 'Promote and optimize your mobile application',
      icon: <FaMobileAlt className="fs-3" />,
      price: '1500.00'
    }
  ];

  // Country codes for phone
  // const countryCodes: CountryCode[] = [
  //   { code: '+1', country: 'US/CA' },
  //   { code: '+44', country: 'UK' },
  //   { code: '+61', country: 'AU' },
  //   { code: '+64', country: 'NZ' },
  //   { code: '+49', country: 'DE' },
  //   { code: '+33', country: 'FR' },
  //   { code: '+91', country: 'IN' },
  //   { code: '+86', country: 'CN' },
  //   { code: '+52', country: 'MX' },
  //   { code: '+81', country: 'JP' }
  // ];

  // Generate calendar days
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, () => null);

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = [
    '9:00 am', '9:30 am', '10:00 am', '10:30 am',
    '11:00 am', '11:30 am', '12:00 pm', '12:30 pm',
    '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
    '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm',
    '5:00 pm', '5:30 pm'
  ];

  const handleNextMonth = (): void => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handlePrevMonth = (): void => {
    // Don't allow going before current month
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (displayYear === currentYear && displayMonth === currentMonth) {
      return;
    }

    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleDateClick = (day: number): void => {
    // Don't allow selecting days before today
    const selectedDate = new Date(displayYear, displayMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setSelectedDate(`${monthNames[displayMonth].substring(0, 3)}, ${day} ${displayYear}`);
    }
  };

  const handleTimeClick = (time: string): void => {
    setSelectedTime(time);
  };

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
  //   setFormData({ ...formData, countryCode: e.target.value });
  // };

  // const handleSubmit = (): void => {
  //   // e.preventDefault();
  //   setStep(4);
  //   setShowCheckout(true);
  // };

  const goBack = (): void => {
    setStep(step - 1);
  };

  const proceedToDateSelection = (): void => {
    if (selectedService) {
      setStep(2);
    }
  };

  const proceedToRegistration = (): void => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const isPastDate = (day: number): boolean => {
    const selectedDate = new Date(displayYear, displayMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return day === today.getDate() &&
      displayMonth === today.getMonth() &&
      displayYear === today.getFullYear();
  };

  const formatServiceTitle = (service: Service | null): string => {
    return service ? service.title : 'No service selected';
  };

  // Custom progress bar based on steps
  const getProgressStep = () => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    if (step === 4) return 100;
    return 0;
  };

  // Add this with other state declarations at the top of the BookingSection component
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Add this new function to reset all form data
  const resetBookingData = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData(initialFormData);
    setClientSecret(null);
  };

  // Update the payment success handler
  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);

    // Save the current booking details for confirmation display
    const bookingDetails = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      customer: { ...formData }
    };

    // Reset all form data
    resetBookingData();

    // Move to confirmation step
    setStep(4);

    // You can use the bookingDetails in step 4 to show the confirmation
    setLastBookingDetails(bookingDetails);
  };

  // Add state for storing last booking details
  const [lastBookingDetails, setLastBookingDetails] = useState<any>(null);

  // Update the "Book Another Consultation" button click handler
  const handleBookAnother = () => {
    resetBookingData();
    setStep(1);
  };

  // Add this function to handle payment intent creation
  const createPaymentIntent = async () => {
    try {
      // Extract numeric value from price string and ensure it's a valid number
      const priceString = selectedService?.price || '';
      const numericAmount = parseFloat(priceString.replace(/[^0-9.]/g, ''));

      if (isNaN(numericAmount)) {
        throw new Error('Invalid price amount');
      }

      console.log('Sending payment intent request:', {
        amount: numericAmount,
        service: selectedService?.title,
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numericAmount,
          currency: 'usd',
          metadata: {
            service: selectedService?.title,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      console.log('Payment intent created successfully');
      return data.clientSecret;
    } catch (error) {
      console.error('Detailed payment intent error:', error);
      throw error;
    }
  };

  // Update the useEffect that handles payment intent creation
  useEffect(() => {
    if (step === 3 && selectedService) {
      setIsLoadingPayment(true);
      createPaymentIntent()
        .then(clientSecret => {
          setClientSecret(clientSecret);
          setPaymentError(null);
        })
        .catch(error => {
          setPaymentError(
            'Failed to initialize payment. Please try again. ' +
            (error.message || '')
          );
          console.error('Payment initialization error:', error);
        })
        .finally(() => {
          setIsLoadingPayment(false);
        });
    }
  }, [step, selectedService]);

  // Update the PaymentForm component
  const PaymentForm = ({
    clientSecret,
    onSuccess,
    selectedService,
    formData,
  }: {
    clientSecret: any;
    onSuccess: any;
    selectedService: any; // ideally replace with specific type
    formData: any;         // ideally replace with specific type
  }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const handleSubmit = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!stripe || !elements || !clientSecret) {
        return;
      }

      setIsProcessing(true);
      setPaymentError('');

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              },
            },
          },
          redirect: 'if_required',
        });

        if (error) {
          setPaymentError(error.message || 'Payment failed');
          console.error('Payment error:', error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          // Clear the payment form elements
          elements.getElement('payment')?.clear();
          onSuccess(paymentIntent);
        }
      } catch (err) {
        setPaymentError('An unexpected error occurred');
        console.error('Payment error:', err);
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="payment-form">
        <div className="mb-4">
          <div className="card-element-container p-3 bg-white rounded">
            <PaymentElement />
          </div>
          {paymentError && (
            <div className="text-danger mt-2 small">
              {paymentError}
            </div>
          )}
        </div>

        <div className="payment-summary mb-4 p-3" style={{ background: styles.bgLight, borderRadius: '8px' }}>
          <div className="d-flex justify-content-between mb-2">
            <span>Service fee</span>
            <span>{selectedService?.price}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>{selectedService?.price}</span>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button" // Change to type="button"
            onClick={handleSubmit} // Add onClick handler
            disabled={!stripe || isProcessing}
            className="btn"
            style={{
              background: styles.gradient,
              color: 'white',
              border: 'none',
              padding: '12px 24px',
            }}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              'Complete Payment'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.section
      id="booking"
      ref={sectionRef}
      className="py-5 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="testimonia4-header text-center blog-hedaer-area heading2 text-center" >
            <h1 className="text-anime-style-1 fs-1 mb-4" > Book Your Consultation </h1>
          </div>
          <p className="lead mx-auto" style={{ color: styles.textMedium, maxWidth: '700px' }}>
            Schedule a consultation with our digital experts to grow your online presence and business.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow border-0 heading1 mb-5 overflow-hidden">
            {/* Progress Bar */}
            <div className="px-4 pt-4">
              <ProgressBar
                now={getProgressStep()}
                style={{
                  height: '8px',
                }}
                variant="none"
              >
                <ProgressBar
                  now={getProgressStep()}
                  style={{
                    backgroundColor: styles.primaryColor
                  }}
                />
              </ProgressBar>

              <Row className="mt-2 text-center heading1 g-0">
                <Col>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-1`}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: step >= 1 ? styles.primaryColor : '#DEE2E6',
                      color: step >= 1 ? 'white' : styles.textMedium
                    }}>
                    1
                  </div>
                  <div className={`small ${step >= 1 ? 'fw-medium' : 'text-muted'}`}>Service</div>
                </Col>
                <Col>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-1`}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: step >= 2 ? styles.primaryColor : '#DEE2E6',
                      color: step >= 2 ? 'white' : styles.textMedium
                    }}>
                    2
                  </div>
                  <div className={`small ${step >= 2 ? 'fw-medium' : 'text-muted'}`}>Date & Time</div>
                </Col>
                <Col>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-1`}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: step >= 3 ? styles.primaryColor : '#DEE2E6',
                      color: step >= 3 ? 'white' : styles.textMedium
                    }}>
                    3
                  </div>
                  <div className={`small ${step >= 3 ? 'fw-medium' : 'text-muted'}`}>Registration</div>
                </Col>
                <Col>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-1`}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: step >= 4 ? styles.primaryColor : '#DEE2E6',
                      color: step >= 4 ? 'white' : styles.textMedium
                    }}>
                    4
                  </div>
                  <div className={`small ${step >= 4 ? 'fw-medium' : 'text-muted'}`}>Confirmation</div>
                </Col>
              </Row>
            </div>

            <Card.Body className="p-4 heading1">
              <AnimatePresence mode="wait">
                {/* Service Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={stepTransition}
                    className="service-selection heading1"
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <div className="d-flex align-items-center">
                        <motion.div
                          className="rounded p-2 me-2"
                          style={{ backgroundColor: styles.primaryColor }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaGlobe className="text-white" />
                        </motion.div>
                        <h3 className="fs-4 fw-semibold m-0" style={{ color: styles.textDark }}>Select a Service</h3>
                      </div>
                      <div className="fs-5" style={{ color: styles.textDark }}>
                        {selectedService ? formatServiceTitle(selectedService) : 'No service selected'}
                      </div>
                    </div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Row className="g-4">
                        {services.map((service) => (
                          <Col key={service.id} md={6} lg={4}>
                            <motion.div
                              variants={itemVariants}
                              whileHover={{ y: -5 }}
                            >
                              <Card
                                className="h-100 cursor-pointer"
                                onClick={() => handleServiceSelect(service)}
                                style={{
                                  borderColor: selectedService?.id === service.id ? styles.primaryColor : '#dee2e6',
                                  backgroundColor: selectedService?.id === service.id ? styles.primaryLight : 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <Card.Body>
                                  <div className="d-flex align-items-center mb-2 heading1">
                                    <motion.div
                                      className="rounded p-2 me-2 text-white heading1"
                                      style={{ backgroundColor: styles.primaryColor }}
                                      whileHover={{ rotate: 15 }}
                                    >
                                      {service.icon}
                                    </motion.div>
                                    <h4 className="fs-5 m-0 heading1" style={{ color: styles.textDark }}>{service.title}</h4>
                                  </div>
                                  <p className="mb-3 heading1" style={{ color: styles.textMedium }}>{service.description}</p>
                                  <div className="d-flex justify-content-between align-items-center heading1">
                                    <span className="fw-bold" style={{ color: styles.textDark }}>{service.price}</span>
                                    {selectedService?.id === service.id && (
                                      <motion.span
                                        className="rounded-circle p-1 d-inline-flex text-white"
                                        style={{ backgroundColor: styles.primaryColor }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      >
                                        <FaCheck />
                                      </motion.span>
                                    )}
                                  </div>
                                </Card.Body>
                              </Card>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </motion.div>

                    <div className="d-flex justify-content-end mt-4">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={proceedToDateSelection}
                          disabled={!selectedService}
                          style={{
                            background: selectedService ? styles.gradient : '#ADB5BD',
                            border: 'none',
                          }}
                          className="px-4 py-2 header-btn1 heading1"
                        >
                          Continue <span className="ms-2">→</span>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Date & Time Selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={stepTransition}
                    className="date-time-selection"
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <motion.div whileHover={{ x: -3 }}>
                        <Button
                          variant="link"
                          onClick={goBack}
                          className="p-0 d-flex align-items-center text-decoration-none"
                          style={{ color: styles.primaryColor }}
                        >
                          <FaArrowLeft className="me-1" /> Back
                        </Button>
                      </motion.div>
                      <div className="text-end">
                        <div className="small text-muted">Selected Service:</div>
                        <div className="fs-5" style={{ color: styles.textDark }}>{formatServiceTitle(selectedService)}</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <motion.div
                        className="rounded p-2 me-2"
                        style={{ backgroundColor: styles.primaryColor }}
                        whileHover={{ rotate: 15 }}
                      >
                        <FaCalendarAlt className="text-white" />
                      </motion.div>
                      <h3 className="fs-4 fw-semibold m-0" style={{ color: styles.textDark }}>Select a Date & Time</h3>
                    </div>

                    <Row>
                      <Col md={6} className="mb-4">
                        <motion.div
                          variants={cardVariants}
                        >
                          <Card className="h-100 border-0" style={{ backgroundColor: '#F8F9FA' }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fs-5 fw-medium m-0" style={{ color: styles.textDark }}>
                                  {monthNames[displayMonth]} {displayYear}
                                </h4>
                                <div className="d-flex gap-1">
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                      variant="link"
                                      onClick={handlePrevMonth}
                                      className="p-2 d-flex align-items-center justify-content-center text-decoration-none"
                                      style={{
                                        color: displayMonth === currentDate.getMonth() && displayYear === currentDate.getFullYear()
                                          ? '#ADB5BD'
                                          : styles.primaryColor,
                                        width: '2rem',
                                        height: '2rem',
                                        padding: '0'
                                      }}
                                      disabled={displayMonth === currentDate.getMonth() && displayYear === currentDate.getFullYear()}
                                    >
                                      <FaChevronLeft />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                      variant="link"
                                      onClick={handleNextMonth}
                                      className="p-2 d-flex align-items-center justify-content-center text-decoration-none"
                                      style={{
                                        color: styles.primaryColor,
                                        width: '2rem',
                                        height: '2rem',
                                        padding: '0'
                                      }}
                                    >
                                      <FaChevronRight />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>

                              <Row className="text-center mb-2 g-0">
                                {dayNames.map(day => (
                                  <Col key={day}>
                                    <div className="small fw-medium" style={{ color: styles.textMedium }}>{day}</div>
                                  </Col>
                                ))}
                              </Row>

                              <Row className="g-1 text-center">
                                {paddingDays.map((_, index) => (
                                  <Col key={`padding-${index}`}>
                                    <div style={{ height: '2.5rem' }}></div>
                                  </Col>
                                ))}

                                {daysArray.map(day => {
                                  const past = isPastDate(day);
                                  const today = isToday(day);
                                  const isSelected = selectedDate === `${monthNames[displayMonth].substring(0, 3)}, ${day} ${displayYear}`;

                                  return (
                                    <Col key={day}>
                                      <motion.div
                                        whileHover={{ scale: past ? 1 : 1.05 }}
                                        whileTap={{ scale: past ? 1 : 0.95 }}
                                      >
                                        <Button
                                          variant={isSelected ? 'primary' : 'light'}
                                          onClick={() => handleDateClick(day)}
                                          disabled={past}
                                          className="rounded-circle p-0 d-flex align-items-center justify-content-center mx-auto"
                                          style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: isSelected ? styles.primaryColor : 'transparent',
                                            border: today ? `2px solid ${styles.secondaryColor}` : 'none',
                                            color: isSelected ? 'white' : past ? '#ADB5BD' : styles.textDark,
                                            opacity: past ? 0.5 : 1,
                                          }}
                                        >
                                          {day}
                                        </Button>
                                      </motion.div>
                                    </Col>
                                  );
                                })}
                              </Row>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="h-100"
                        >
                          <div className="d-flex align-items-center mb-3">
                            <FaClock className="me-2" style={{ color: styles.primaryColor }} />
                            <h4 className="fs-5 fw-medium m-0" style={{ color: styles.textDark }}>Available Times</h4>
                          </div>

                          <div className="time-slots" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                            <Row className="g-2">
                              {timeSlots.map((time, index) => (
                                <Col key={time} xs={6} md={6} lg={6}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.03 }}
                                  >
                                    <Button
                                      variant={selectedTime === time ? 'primary' : 'outline-secondary'}
                                      onClick={() => handleTimeClick(time)}
                                      className="w-100 py-2 text-center"
                                      style={{
                                        backgroundColor: selectedTime === time ? styles.primaryColor : 'white',
                                        borderColor: selectedTime === time ? styles.primaryColor : '#DEE2E6',
                                        color: selectedTime === time ? 'white' : styles.textDark,
                                      }}
                                    >
                                      {time}
                                    </Button>
                                  </motion.div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        </motion.div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="fs-5" style={{ color: styles.textDark }}>
                        {selectedDate
                          ? `Selected: ${selectedDate} at ${selectedTime || '(no time selected)'}`
                          : 'No date selected'}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={proceedToRegistration}
                          disabled={!selectedDate || !selectedTime}
                          style={{
                            background: selectedDate && selectedTime ? styles.gradient : '#ADB5BD',
                            border: 'none',
                          }}
                          className="px-4 py-2 header-btn1"
                        >
                          Continue <span className="ms-2 ">→</span>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Registration Form */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={stepTransition}
                    className="registration-form"
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                      <motion.div whileHover={{ x: -3 }}>
                        <Button
                          variant="link"
                          onClick={goBack}
                          className="p-0 d-flex align-items-center text-decoration-none"
                          style={{ color: styles.primaryColor }}
                        >
                          <FaArrowLeft className="me-1" /> Back
                        </Button>
                      </motion.div>
                      <div className="text-end">
                        <div className="small text-muted">Your appointment:</div>
                        <div style={{ color: styles.textDark }}>{formatServiceTitle(selectedService)}</div>
                        <div style={{ color: styles.textDark }}>{selectedDate} at {selectedTime}</div>
                      </div>
                    </div>

                    <div className="booking-form-container">
                      <h3 className="fs-4 fw-semibold mb-4" style={{ color: styles.textDark }}>
                        Complete Your Booking
                      </h3>

                      <Form onSubmit={(e) => e.preventDefault()}>
                        <div className="personal-info mb-4">
                          <h4 className="fs-5 mb-3">Personal Information</h4>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  placeholder="Full Name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  placeholder="Email Address"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  placeholder="Phone Number"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        <div className="payment-section mb-4">
                          <h4 className="fs-5 mb-3">Payment Details</h4>
                          {isLoadingPayment ? (
                            <div className="text-center p-4">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <p className="mt-2">Initializing payment...</p>
                            </div>
                          ) : paymentError ? (
                            <div className="alert alert-danger">
                              {paymentError}
                              <button
                                className="btn btn-link"
                                onClick={() => {
                                  setPaymentError(null);
                                  createPaymentIntent();
                                }}
                              >
                                Try again
                              </button>
                            </div>
                          ) : clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: 'stripe',
                                  variables: {
                                    colorPrimary: '#4E2FDA',
                                  },
                                },
                              }}
                            >
                              <PaymentForm
                                clientSecret={clientSecret}
                                onSuccess={handlePaymentSuccess}
                                selectedService={selectedService}
                                formData={formData}
                              />
                            </Elements>
                          ) : null}
                        </div>
                      </Form>
                    </div>
                  </motion.div>
                )}

                {/* Confirmation */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="confirmation text-center p-4"
                  >
                    <motion.div
                      className="success-icon mb-4"
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <div
                        className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <FaCheck className="text-white" style={{ fontSize: '2rem' }} />
                      </div>
                    </motion.div>

                    <h3 className="mb-3">Booking Confirmed!</h3>
                    <p className="text-muted mb-4">
                      Thank you for your booking. We have sent a confirmation email with all the details.
                    </p>

                    {lastBookingDetails && (
                      <div className="booking-details text-start mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="card p-3 mb-4">
                          <h5 className="mb-3">Booking Details</h5>
                          <p className="mb-2">
                            <strong>Service:</strong> {lastBookingDetails.service?.title}
                          </p>
                          <p className="mb-2">
                            <strong>Date:</strong> {lastBookingDetails.date}
                          </p>
                          <p className="mb-2">
                            <strong>Time:</strong> {lastBookingDetails.time}
                          </p>
                          <p className="mb-2">
                            <strong>Name:</strong> {lastBookingDetails.customer.name}
                          </p>
                          <p className="mb-2">
                            <strong>Email:</strong> {lastBookingDetails.customer.email}
                          </p>
                          <p className="mb-0">
                            <strong>Phone:</strong> {lastBookingDetails.customer.countryCode} {lastBookingDetails.customer.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleBookAnother}
                      className="btn"
                      style={{
                        background: styles.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                      }}
                    >
                      Book Another Consultation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Body>
          </Card>
        </motion.div>

        {showCheckout && (
          <CheckoutPage
            selectedService={selectedService}
            onBack={() => setShowCheckout(false)}
            onComplete={() => {
              setShowCheckout(false);
              setStep(4); // Move to confirmation step
            }}
          />
        )}
      </Container>
    </motion.section>
  );
};

export default BookingSection;