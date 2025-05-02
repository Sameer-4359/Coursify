import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../componentscss/coursespage.css';
import Menu from './Menu';
import Footer from './Footer';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCourseClick = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
        <Menu />
    
        <div className="all-courses-page">
        <div className="all-courses-header">
            <h1>Explore Our Courses</h1>
            <p>Browse through our comprehensive collection of courses</p>
            
            <div className="all-search-filter-container">
            <div className="all-search-bar">
                <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </div>
            
            <div className="all-filter-dropdown">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="web">Web Development</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="data">Data Science</option>
                </select>
            </div>
            </div>
        </div>

        <div className="all-courses-grid">
            {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
                <div 
                key={course.id} 
                className="all-course-card"
                onClick={() => handleCourseClick(course.id)}
                >
                <div className="all-course-image">
                    <img src={course.img} alt={course.title} />
                    <div className="all-course-category">{course.category}</div>
                </div>
                <div className="all-course-details">
                    <h3>{course.title}</h3>
                    <p className="all-instructor">by {course.instructor}</p>
                    <div className="all-rating">
                    <div className="all-stars">
                        {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(course.rating) ? '#FFD700' : '#DDD'}
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        ))}
                    </div>
                    <span>({course.reviews})</span>
                    </div>
                    <div className="all-price-enroll">
                    <span className="all-price">${course.price}</span>
                    <span className="all-enrolled">{course.enrolled} students</span>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <div className="all-no-results">
                <h3>No courses found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
            )}
        </div>
            
        </div>
        <Footer />
    </div>
  );
}

export default CoursesPage;