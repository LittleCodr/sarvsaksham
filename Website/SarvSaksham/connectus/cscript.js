document.addEventListener('DOMContentLoaded', function() {
    // Sample hospital data
    const hospitals = [
        {
            id: 1,
            name: "Apollo Hospitals",
            image: "https://via.placeholder.com/400x200?text=Apollo+Hospitals",
            rating: 4.8,
            specialty: "Multi-Specialty",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: true }
            ],
            pricing: [
                { service: "General Consultation", price: "₹500", onlinePrice: "₹300" },
                { service: "Specialist Consultation", price: "₹1500", onlinePrice: "₹1000" },
                { service: "Emergency Care", price: "₹2000", discount: "10% for armed forces" }
            ]
        },
        {
            id: 2,
            name: "Fortis Hospital",
            image: "https://via.placeholder.com/400x200?text=Fortis+Hospital",
            rating: 4.6,
            specialty: "Cardiology",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: false }
            ],
            pricing: [
                { service: "General Consultation", price: "₹600", onlinePrice: "₹400" },
                { service: "Cardiac Consultation", price: "₹2000", onlinePrice: "₹1500" },
                { service: "Emergency Care", price: "₹2500", discount: "15% for armed forces" }
            ]
        },
        {
            id: 3,
            name: "Max Super Specialty",
            image: "https://via.placeholder.com/400x200?text=Max+Super+Specialty",
            rating: 4.7,
            specialty: "Neurology",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: true }
            ],
            pricing: [
                { service: "General Consultation", price: "₹550", onlinePrice: "₹350" },
                { service: "Neurology Consultation", price: "₹1800", onlinePrice: "₹1200" },
                { service: "Emergency Care", price: "₹2200", discount: "20% for armed forces" }
            ]
        },
        {
            id: 4,
            name: "Medanta - The Medicity",
            image: "https://via.placeholder.com/400x200?text=Medanta",
            rating: 4.9,
            specialty: "Multi-Specialty",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: true }
            ],
            pricing: [
                { service: "General Consultation", price: "₹700", onlinePrice: "₹500" },
                { service: "Specialist Consultation", price: "₹2500", onlinePrice: "₹1800" },
                { service: "Emergency Care", price: "₹3000", discount: "25% for armed forces" }
            ]
        },
        {
            id: 5,
            name: "AIIMS Delhi",
            image: "https://via.placeholder.com/400x200?text=AIIMS+Delhi",
            rating: 4.5,
            specialty: "Government Hospital",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: false },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: true }
            ],
            pricing: [
                { service: "General Consultation", price: "₹100", onlinePrice: "N/A" },
                { service: "Specialist Consultation", price: "₹200", onlinePrice: "N/A" },
                { service: "Emergency Care", price: "Free for armed forces" }
            ]
        },
        {
            id: 6,
            name: "Artemis Hospital",
            image: "https://via.placeholder.com/400x200?text=Artemis+Hospital",
            rating: 4.4,
            specialty: "Orthopedics",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: false }
            ],
            pricing: [
                { service: "General Consultation", price: "₹650", onlinePrice: "₹450" },
                { service: "Orthopedic Consultation", price: "₹1700", onlinePrice: "₹1200" },
                { service: "Emergency Care", price: "₹2300", discount: "10% for armed forces" }
            ]
        },
        {
            id: 7,
            name: "Narayana Health",
            image: "https://via.placeholder.com/400x200?text=Narayana+Health",
            rating: 4.3,
            specialty: "Pediatrics",
            facilities: [
                { name: "24/7 Emergency", available: true },
                { name: "ICU", available: true },
                { name: "Online Consultation", available: true },
                { name: "Pharmacy", available: true },
                { name: "Ambulance", available: true }
            ],
            pricing: [
                { service: "General Consultation", price: "₹500", onlinePrice: "₹300" },
                { service: "Pediatric Consultation", price: "₹1500", onlinePrice: "₹1000" },
                { service: "Emergency Care", price: "₹2000", discount: "15% for armed forces" }
            ]
        }
    ];

    // Function to render hospital cards
    function renderHospitalCards(hospitalsToRender) {
        const container = document.querySelector('.hospital-cards-container');
        container.innerHTML = '';

        hospitalsToRender.forEach(hospital => {
            const card = document.createElement('div');
            card.className = 'hospital-card';

            // Generate stars for rating
            const stars = '★'.repeat(Math.floor(hospital.rating)) + '☆'.repeat(5 - Math.floor(hospital.rating));
            
            // Generate facilities list
            const facilitiesList = hospital.facilities.map(facility => `
                <div class="facility-item">
                    <span class="facility-icon">${facility.available ? '✓' : '✗'}</span>
                    <span>${facility.name}</span>
                </div>
            `).join('');

            // Generate pricing table
            const pricingTable = hospital.pricing.map(price => `
                <div class="price-item">
                    <span>${price.service}</span>
                    <span>
                        ${price.price}
                        ${price.onlinePrice ? ` / <span class="online-price">${price.onlinePrice} (Online)</span>` : ''}
                        ${price.discount ? `<span class="discount-badge">${price.discount}</span>` : ''}
                    </span>
                </div>
            `).join('');

            card.innerHTML = `
                <img src="${hospital.image}" alt="${hospital.name}" class="hospital-image">
                <div class="hospital-info">
                    <h3 class="hospital-name">${hospital.name}</h3>
                    <div class="hospital-rating">
                        <span class="rating-stars">${stars}</span>
                        <span>${hospital.rating}/5</span>
                    </div>
                    <span class="hospital-specialty">${hospital.specialty}</span>
                    <div class="hospital-facilities">
                        ${facilitiesList}
                    </div>
                    <div class="pricing">
                        <h4>Pricing</h4>
                        ${pricingTable}
                    </div>
                    <div class="actions">
                        <button class="action-btn primary-btn">Book Appointment</button>
                        <button class="action-btn secondary-btn">View Details</button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    // Initial render
    renderHospitalCards(hospitals);

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredHospitals = hospitals.filter(hospital => 
            hospital.name.toLowerCase().includes(searchTerm) || 
            hospital.specialty.toLowerCase().includes(searchTerm)
        );
        renderHospitalCards(filteredHospitals);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filter functionality
    const specialtyFilter = document.getElementById('specialty-filter');
    const facilityFilter = document.getElementById('facility-filter');
    
    function applyFilters() {
        const specialtyValue = specialtyFilter.value;
        const facilityValue = facilityFilter.value;
        
        let filteredHospitals = hospitals;
        
        if (specialtyValue) {
            filteredHospitals = filteredHospitals.filter(hospital => 
                hospital.specialty.toLowerCase() === specialtyValue
            );
        }
        
        if (facilityValue) {
            filteredHospitals = filteredHospitals.filter(hospital => {
                if (facilityValue === 'emergency') {
                    return hospital.facilities.some(f => f.name === '24/7 Emergency' && f.available);
                } else if (facilityValue === 'icu') {
                    return hospital.facilities.some(f => f.name === 'ICU' && f.available);
                } else if (facilityValue === 'pharmacy') {
                    return hospital.facilities.some(f => f.name === 'Pharmacy' && f.available);
                }
                return true;
            });
        }
        
        renderHospitalCards(filteredHospitals);
    }
    
    specialtyFilter.addEventListener('change', applyFilters);
    facilityFilter.addEventListener('change', applyFilters);
});