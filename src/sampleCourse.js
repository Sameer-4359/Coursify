// courseDetail.js
const courseDetail = {
  id: 101,
  title: "JavaScript for Beginners",
  instructor: "John Doe",
  rating: 4.5,
  description:
    "An in-depth course for beginners to learn JavaScript from scratch.",
  category: "Web Development",
  level: "Beginner",
  price: 29.99,
  duration: "12 hours",
  imageUrl: "https://picsum.photos/200",
  modules: [
    {
      moduleId: 1,
      title: "Introduction to JavaScript",
      lessons: [
        {
          lessonId: 1,
          title: "What is JavaScript?",
          content: "Video link or text",
        },
        {
          lessonId: 2,
          title: "Setting up the Environment",
          content: "Video link or text",
        },
      ],
    },
    {
      moduleId: 2,
      title: "JavaScript Basics",
      lessons: [
        {
          lessonId: 3,
          title: "Variables and Data Types",
          content: "Video link or text",
        },
        {
          lessonId: 4,
          title: "Functions and Scope",
          content: "Video link or text",
        },
      ],
    },
  ],
  reviews: [
    {
      reviewId: 1,
      studentName: "Jane Smith",
      rating: 5,
      reviewText: "Great course for beginners!",
    },
    {
      reviewId: 2,
      studentName: "Alex Johnson",
      rating: 4,
      reviewText: "Very informative, easy to understand.",
    },
  ],
};

export default courseDetail;
