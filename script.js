// Global variables
let jobsData = [];
let activeFilters = [];

// DOM elements
const jobListings = document.getElementById('jobListings');
const filterBar = document.getElementById('filterBar');
const filterTags = document.getElementById('filterTags');
const clearBtn = document.getElementById('clearBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOM loaded, initializing app...');
    await loadJobsData();
    renderJobs(jobsData);
    setupEventListeners();
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
});

// Load jobs data from JSON file
async function loadJobsData() {
  try {
    console.log('Loading jobs data...');
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    jobsData = await response.json();
    console.log('Jobs data loaded:', jobsData.length, 'jobs');
  } catch (error) {
    console.error('Error loading jobs data:', error);
    // Fallback: use inline data if fetch fails
    jobsData = getInlineJobsData();
    console.log('Using fallback data:', jobsData.length, 'jobs');
  }
}

// Render job listings
function renderJobs(jobs) {
  jobListings.innerHTML = '';
  
  jobs.forEach(job => {
    const jobCard = createJobCard(job);
    jobListings.appendChild(jobCard);
  });
}

// Create individual job card
function createJobCard(job) {
  const jobCard = document.createElement('div');
  jobCard.className = `job-card ${job.featured ? 'featured' : ''}`;
  
  // Combine all filterable tags
  const allTags = [job.role, job.level, ...job.languages, ...job.tools];
  
  jobCard.innerHTML = `
    <div class="job-logo">
      <img src="${job.logo}" alt="${job.company} logo">
    </div>
    <div class="job-info">
      <div class="job-header">
        <span class="company-name">${job.company}</span>
        <div class="job-badges">
          ${job.new ? '<span class="badge new">New!</span>' : ''}
          ${job.featured ? '<span class="badge featured">Featured</span>' : ''}
        </div>
      </div>
      <h2 class="job-title">${job.position}</h2>
      <div class="job-details">
        <span>${job.postedAt}</span>
        <span>${job.contract}</span>
        <span>${job.location}</span>
      </div>
    </div>
    <div class="job-tags">
      ${allTags.map(tag => `<span class="tag" data-filter="${tag.toLowerCase()}">${tag}</span>`).join('')}
    </div>
  `;
  
  return jobCard;
}

// Setup event listeners
function setupEventListeners() {
  // Clear button
  clearBtn.addEventListener('click', clearAllFilters);
  
  // Job tag clicks (event delegation)
  jobListings.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
      const filter = e.target.dataset.filter;
      addFilter(filter);
    }
  });
}

// Add filter
function addFilter(filter) {
  if (!activeFilters.includes(filter)) {
    activeFilters.push(filter);
    updateFilterBar();
    filterJobs();
  }
}

// Remove filter
function removeFilter(filter) {
  activeFilters = activeFilters.filter(f => f !== filter);
  updateFilterBar();
  filterJobs();
}

// Clear all filters
function clearAllFilters() {
  activeFilters = [];
  updateFilterBar();
  filterJobs();
}

// Update filter bar display
function updateFilterBar() {
  if (activeFilters.length === 0) {
    filterBar.classList.remove('active');
    return;
  }
  
  filterBar.classList.add('active');
  
  filterTags.innerHTML = activeFilters.map(filter => `
    <div class="filter-tag">
      <span>${capitalizeFirst(filter)}</span>
      <button onclick="removeFilter('${filter}')">
        <img src="./images/icon-remove.svg" alt="Remove filter">
      </button>
    </div>
  `).join('');
}

// Filter jobs based on active filters
function filterJobs() {
  if (activeFilters.length === 0) {
    renderJobs(jobsData);
    return;
  }
  
  const filteredJobs = jobsData.filter(job => {
    const jobTags = [
      job.role.toLowerCase(),
      job.level.toLowerCase(),
      ...job.languages.map(lang => lang.toLowerCase()),
      ...job.tools.map(tool => tool.toLowerCase())
    ];
    
    return activeFilters.every(filter => jobTags.includes(filter));
  });
  
  renderJobs(filteredJobs);
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fallback data in case JSON loading fails
function getInlineJobsData() {
  return [
    {
      "id": 1,
      "company": "Photosnap",
      "logo": "./images/photosnap.svg",
      "new": true,
      "featured": true,
      "position": "Senior Frontend Developer",
      "role": "Frontend",
      "level": "Senior",
      "postedAt": "1d ago",
      "contract": "Full Time",
      "location": "USA Only",
      "languages": ["HTML", "CSS", "JavaScript"],
      "tools": []
    },
    {
      "id": 2,
      "company": "Manage",
      "logo": "./images/manage.svg",
      "new": true,
      "featured": true,
      "position": "Fullstack Developer",
      "role": "Fullstack",
      "level": "Midweight",
      "postedAt": "1d ago",
      "contract": "Part Time",
      "location": "Remote",
      "languages": ["Python"],
      "tools": ["React"]
    },
    {
      "id": 3,
      "company": "Account",
      "logo": "./images/account.svg",
      "new": true,
      "featured": false,
      "position": "Junior Frontend Developer",
      "role": "Frontend",
      "level": "Junior",
      "postedAt": "2d ago",
      "contract": "Part Time",
      "location": "USA Only",
      "languages": ["JavaScript"],
      "tools": ["React", "Sass"]
    },
    {
      "id": 4,
      "company": "MyHome",
      "logo": "./images/myhome.svg",
      "new": false,
      "featured": false,
      "position": "Junior Frontend Developer",
      "role": "Frontend",
      "level": "Junior",
      "postedAt": "5d ago",
      "contract": "Contract",
      "location": "USA Only",
      "languages": ["CSS", "JavaScript"],
      "tools": []
    },
    {
      "id": 5,
      "company": "Loop Studios",
      "logo": "./images/loop-studios.svg",
      "new": false,
      "featured": false,
      "position": "Software Engineer",
      "role": "Fullstack",
      "level": "Midweight",
      "postedAt": "1w ago",
      "contract": "Full Time",
      "location": "Worldwide",
      "languages": ["JavaScript", "Ruby"],
      "tools": ["Sass"]
    },
    {
      "id": 6,
      "company": "FaceIt",
      "logo": "./images/faceit.svg",
      "new": false,
      "featured": false,
      "position": "Junior Backend Developer",
      "role": "Backend",
      "level": "Junior",
      "postedAt": "2w ago",
      "contract": "Full Time",
      "location": "UK Only",
      "languages": ["Ruby"],
      "tools": ["RoR"]
    },
    {
      "id": 7,
      "company": "Shortly",
      "logo": "./images/shortly.svg",
      "new": false,
      "featured": false,
      "position": "Junior Developer",
      "role": "Frontend",
      "level": "Junior",
      "postedAt": "2w ago",
      "contract": "Full Time",
      "location": "Worldwide",
      "languages": ["HTML", "JavaScript"],
      "tools": ["Sass"]
    },
    {
      "id": 8,
      "company": "Insure",
      "logo": "./images/insure.svg",
      "new": false,
      "featured": false,
      "position": "Junior Frontend Developer",
      "role": "Frontend",
      "level": "Junior",
      "postedAt": "2w ago",
      "contract": "Full Time",
      "location": "USA Only",
      "languages": ["JavaScript"],
      "tools": ["Vue", "Sass"]
    },
    {
      "id": 9,
      "company": "Eyecam Co.",
      "logo": "./images/eyecam-co.svg",
      "new": false,
      "featured": false,
      "position": "Full Stack Engineer",
      "role": "Fullstack",
      "level": "Midweight",
      "postedAt": "3w ago",
      "contract": "Full Time",
      "location": "Worldwide",
      "languages": ["JavaScript", "Python"],
      "tools": ["Django"]
    },
    {
      "id": 10,
      "company": "The Air Filter Company",
      "logo": "./images/the-air-filter-company.svg",
      "new": false,
      "featured": false,
      "position": "Front-end Dev",
      "role": "Frontend",
      "level": "Junior",
      "postedAt": "1mo ago",
      "contract": "Part Time",
      "location": "Worldwide",
      "languages": ["JavaScript"],
      "tools": ["React", "Sass"]
    }
  ];
}
