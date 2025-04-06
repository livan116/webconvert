import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import shopPayLogo from '../../assets/img/all-images/about-img1.png';
import amazonPayLogo from '../../assets/img/all-images/about-img1.png';
import applePayLogo from '../../assets/img/all-images/about-img1.png';
import paypalLogo from '../../assets/img/all-images/about-img1.png';

interface CheckoutPageProps {
    selectedService: any;
    onBack: () => void;
    onComplete: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ selectedService, onBack, onComplete }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        country: 'United States',
        state: '',
        zipCode: '',
        phone: '',
        subscribeToNews: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would integrate with your payment processor
        // For demo purposes, we'll just simulate a successful payment
        setTimeout(onComplete, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="checkout-container"
        >
            <div className="breadcrumb-nav mb-4">
                <span>Information</span> › <span>Shipping</span> › <span>Payment</span>
            </div>

            <div className="express-checkout mb-4">
                <h4>Express checkout</h4>
                <div className="payment-buttons">
                    <button className="shop-pay">
                        <img src={shopPayLogo} alt="Shop Pay" />
                    </button>
                    <button className="amazon-pay">
                        <img src={amazonPayLogo} alt="Amazon Pay" />
                    </button>
                    <button className="apple-pay">
                        <img src={applePayLogo} alt="Apple Pay" />
                    </button>
                    <button className="paypal">
                        <img src={paypalLogo} alt="PayPal" />
                    </button>
                </div>
            </div>

            <div className="divider">
                <span>OR CONTINUE BELOW TO PAY WITH A CREDIT CARD</span>
            </div>

            <Form onSubmit={handleSubmit}>
                <div className="contact-info mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Contact information</h4>
                        <div className="already-account">
                            Already have an account? <a href="#">Log in</a>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="subscribeToNews"
                            label="Email me with news and offers"
                            checked={formData.subscribeToNews}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </div>

                <div className="shipping-address mb-4">
                    <h4>Shipping address</h4>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <Form.Control
                                type="text"
                                name="company"
                                placeholder="Company (required for business addresses)"
                                value={formData.company}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-12">
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <Form.Control
                                type="text"
                                name="apartment"
                                placeholder="Apartment, suite, etc. (optional)"
                                value={formData.apartment}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-12">
                            <Form.Control
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <Form.Select
                                name="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange(e as any)}
                                required
                            >
                                <option value="United States">United States</option>
                                {/* Add more countries as needed */}
                            </Form.Select>
                        </div>
                        <div className="col-md-4">
                            <Form.Select
                                name="state"
                                value={formData.state}
                                onChange={(e) => handleInputChange(e as any)}
                             
                            >
                                <option value="">State...</option>
                                <option value="">State...</option>
                                <option value="">State...</option>
                                {/* Add states here */}
                            </Form.Select>
                        </div>
                        <div className="col-md-4">
                            <Form.Control
                                type="text"
                                name="zipCode"
                                placeholder="ZIP code"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Phone (optional)"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="order-summary p-3 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>${selectedService?.price || '0.00'}</span>
                    </div>
                    <div className="shipping-note mb-2">
                        ** Expedited orders cannot be shipped or delivered on weekends/holidays nor can they be shipped to a PO Box.
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Total</span>
                        <span className="h4">USD ${selectedService?.price || '0.00'}</span>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <Button
                        variant="link"
                        onClick={onBack}
                        className="return-link"
                    >
                        Return to consultation details
                    </Button>
                    <Button
                        type="submit"
                        className="continue-btn"
                    >
                        CONTINUE TO SHIPPING
                    </Button>
                </div>
            </Form>
        </motion.div>
    );
};

export default CheckoutPage; 