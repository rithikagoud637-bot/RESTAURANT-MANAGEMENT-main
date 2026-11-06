import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container py-4">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
          <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
            Concierge Assistance
          </span>
          <h1 className="fw-bold text-dark mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
            Get in Touch
          </h1>
          <p className="text-secondary">
            Have questions regarding a dining reservation or interested in partnering your restaurant with GourmetReserve? Our team is at your service.
          </p>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <h4 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                Concierge Information
              </h4>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-danger fs-5">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Headquarters</h6>
                    <p className="text-secondary small mb-0">100 Culinary Plaza, Suite 400<br />Epicurean Way, NY 10001</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-warning fs-5">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Direct Telephone</h6>
                    <p className="text-secondary small mb-0">+1 (800) 555-DINE (3463)<br />Toll-free customer hotline</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-success fs-5">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Electronic Mail</h6>
                    <p className="text-secondary small mb-0">support@gourmetreserve.com<br />partnerships@gourmetreserve.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-3 rounded-circle text-primary fs-5">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Operating Hours</h6>
                    <p className="text-secondary small mb-0">Monday – Sunday<br />9:00 AM – Midnight EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <h4 className="fw-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Send Us a Message
              </h4>
              <p className="text-secondary small mb-4">
                Fill out the form below and a representative will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="alert alert-success py-4 text-center">
                  <i className="bi bi-check-circle-fill display-5 text-success mb-3 d-block"></i>
                  <h5>Inquiry Received!</h5>
                  <p className="small mb-0">Thank you for reaching out to GourmetReserve. Our concierge desk will review your message shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Subject *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Reservation assistance, partnership inquiry, etc."
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Message Details *</label>
                      <textarea
                        rows="4"
                        className="form-control"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe how we can assist you..."
                      ></textarea>
                    </div>

                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-burgundy px-4 py-2">
                        <i className="bi bi-send me-2"></i> Submit Inquiry
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

