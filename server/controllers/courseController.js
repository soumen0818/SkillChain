const Course = require('../models/Course');
const User = require('../models/User');

const createCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    duration,
    price,
    skillTokenReward,
    prerequisites,
    learningOutcomes,
    thumbnail,
    syllabus,
    status = 'draft'
  } = req.body;

  try {
    // Calculate modules and total lessons from syllabus
    const modules = syllabus ? syllabus.length : 0;
    const totalLessons = syllabus ? syllabus.reduce((total, module) => total + (module.lessons ? module.lessons.length : 0), 0) : 0;

    const course = new Course({
      title,
      description,
      category,
      level,
      duration,
      price,
      skillTokenReward,
      prerequisites: prerequisites || [],
      learningOutcomes: learningOutcomes || [],
      thumbnail,
      teacher: req.user._id,
      syllabus: syllabus || [],
      status,
      modules,
      totalLessons,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(course._id);
    course.students.push(req.user._id);

    await user.save();
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: { $ne: 'draft' } }).populate('teacher', 'username email walletAddress');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'username email walletAddress');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'username email walletAddress');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the teacher of the course
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('teacher', 'username email walletAddress');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }).populate('teacher', 'username email walletAddress');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the teacher of the course
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'teacher',
        select: 'username email walletAddress'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher analytics data
const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get all courses for this teacher
    const courses = await Course.find({ teacher: teacherId }).populate('students', 'username email');

    // Calculate analytics
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const draftCourses = courses.filter(c => c.status === 'draft').length;
    const totalStudents = courses.reduce((sum, course) => sum + course.students.length, 0);
    const totalEarnings = courses.reduce((sum, course) => {
      const earningsStr = course.earnings || '0 ETH';
      const earnings = parseFloat(earningsStr.toString().split(' ')[0]) || 0;
      return sum + earnings;
    }, 0);
    const totalCertificates = courses.reduce((sum, course) => sum + course.certificates, 0);
    const averageRating = courses.length > 0 ?
      courses.reduce((sum, course) => sum + course.rating, 0) / courses.length : 0;
    const totalReviews = courses.reduce((sum, course) => sum + course.reviews, 0);

    // Generate monthly data based on course creation dates
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];

      const coursesInMonth = courses.filter(course => {
        const courseDate = new Date(course.createdAt);
        return courseDate.getMonth() === targetDate.getMonth() &&
          courseDate.getFullYear() === targetDate.getFullYear();
      });

      const monthEarnings = coursesInMonth.reduce((sum, course) => {
        const earningsStr = course.earnings || '0 ETH';
        const earnings = parseFloat(earningsStr.toString().split(' ')[0]) || 0;
        return sum + earnings;
      }, 0);

      const monthStudents = coursesInMonth.reduce((sum, course) => sum + course.students.length, 0);
      const monthCertificates = coursesInMonth.reduce((sum, course) => sum + course.certificates, 0);

      monthlyData.push({
        month: monthName,
        earnings: monthEarnings,
        students: monthStudents,
        certificates: monthCertificates,
        courses: coursesInMonth.length
      });
    }

    // Course performance data
    const coursePerformance = courses.map(course => {
      const earningsStr = course.earnings || '0 ETH';
      const earnings = parseFloat(earningsStr.toString().split(' ')[0]) || 0;

      return {
        id: course._id,
        title: course.title,
        thumbnail: course.thumbnail || '',
        status: course.status,
        students: course.students.length,
        completion: Math.floor(Math.random() * 100), // This could be calculated from actual progress data
        rating: course.rating,
        earnings: earnings,
        certificates: course.certificates,
        enrollmentTrend: course.enrollmentTrend,
        lastActivity: course.updatedAt,
        category: course.category || 'General'
      };
    });

    // Student engagement data (calculated from real data where possible)
    const allStudents = courses.flatMap(course => course.students);
    const uniqueStudents = [...new Set(allStudents.map(s => s._id.toString()))];

    const studentEngagement = {
      totalWatchTime: `${Math.floor(totalStudents * 2.5)} hours`, // Estimated based on student count
      averageSessionTime: '28 minutes', // This could be tracked with analytics
      completionRate: Math.floor((totalCertificates / Math.max(totalStudents, 1)) * 100),
      dropoffPoints: ['Module 3: Advanced Concepts', 'Quiz 2: Practical Assessment'], // This needs progress tracking
      peakHours: ['2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM'], // This needs activity tracking
      deviceBreakdown: { desktop: 65, mobile: 25, tablet: 10 } // This needs device tracking
    };

    // Revenue breakdown
    const revenueBreakdown = {
      courseRevenue: totalEarnings,
      platformFees: totalEarnings * 0.05,
      skillTokenRewards: totalCertificates * 10, // Estimated skill tokens given
      projectedAnnual: totalEarnings * 12 // Simple projection
    };

    // Student details for each course
    const studentDetails = courses.map(course => ({
      courseId: course._id,
      courseTitle: course.title,
      students: course.students.map(student => ({
        id: student._id,
        username: student.username,
        email: student.email,
        enrolledAt: course.createdAt, // This should be tracked separately
        progress: Math.floor(Math.random() * 100), // This needs progress tracking
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random last activity
        certificateEarned: Math.random() > 0.7 // Random certificate status
      }))
    }));

    const analyticsData = {
      totalCourses,
      activeCourses,
      draftCourses,
      totalStudents,
      totalEarnings,
      totalCertificates,
      averageRating,
      totalReviews,
      monthlyData,
      coursePerformance,
      studentEngagement,
      revenueBreakdown,
      studentDetails
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching teacher analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get individual course analytics data
const getCourseAnalytics = async (req, res) => {
  try {
    const { id: courseId } = req.params; // Extract id parameter and rename to courseId
    const teacherId = req.user._id;

    // Get the specific course and verify ownership
    const course = await Course.findOne({ _id: courseId, teacher: teacherId }).populate('students', 'username email name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    // Calculate course-specific analytics
    const totalStudents = course.students.length;
    const earningsStr = course.earnings || '0 ETH';
    const totalEarnings = parseFloat(earningsStr.toString().split(' ')[0]) || 0;
    const certificatesIssued = course.certificates || 0;
    const completionRate = totalStudents > 0 ? Math.floor((certificatesIssued / totalStudents) * 100) : 0;

    // Generate enrollment trend (simulated weekly data)
    const enrollmentTrend = [];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    let cumulativeStudents = 0;
    let cumulativeRevenue = 0;

    weeks.forEach((week, index) => {
      const weeklyStudents = Math.floor(totalStudents / 4) + (index === 3 ? totalStudents % 4 : 0);
      const weeklyRevenue = Math.floor((totalEarnings / 4) * 100) / 100;
      cumulativeStudents += weeklyStudents;
      cumulativeRevenue += weeklyRevenue;

      enrollmentTrend.push({
        period: week,
        students: weeklyStudents,
        revenue: weeklyRevenue,
        cumulativeStudents: cumulativeStudents,
        cumulativeRevenue: Math.floor(cumulativeRevenue * 100) / 100
      });
    });

    // Generate module completion rates (based on syllabus)
    const moduleCompletion = [];
    if (course.syllabus && course.syllabus.length > 0) {
      course.syllabus.forEach((module, index) => {
        // Simulate decreasing completion rates as modules progress
        const baseCompletion = 95 - (index * 5);
        const randomVariation = Math.floor(Math.random() * 10) - 5;
        const completion = Math.max(60, Math.min(100, baseCompletion + randomVariation));

        moduleCompletion.push({
          module: module.title || `Module ${index + 1}`,
          completion: completion,
          studentsCompleted: Math.floor((completion / 100) * totalStudents)
        });
      });
    } else {
      // Default modules if no syllabus
      for (let i = 1; i <= 5; i++) {
        const completion = Math.max(60, 100 - (i * 8) + Math.floor(Math.random() * 10));
        moduleCompletion.push({
          module: `Module ${i}`,
          completion: completion,
          studentsCompleted: Math.floor((completion / 100) * totalStudents)
        });
      }
    }

    // Generate student progress data
    const studentProgress = course.students.map(student => {
      const progress = Math.floor(Math.random() * 40) + 60; // Random progress between 60-100%
      const timeSpent = Math.floor(Math.random() * 20) + 10; // Random hours between 10-30
      const lastActive = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random within last week
      const rating = Math.floor(Math.random() * 2) + 4; // Rating between 4-5

      return {
        id: student._id,
        name: student.name || student.username,
        email: student.email,
        progress: progress,
        timeSpent: `${timeSpent}h`,
        lastActive: getTimeAgo(lastActive),
        rating: rating,
        certificateEarned: progress >= 90
      };
    });

    // Generate feedback data (sample feedback)
    const feedback = studentProgress.slice(0, 3).map(student => {
      const comments = [
        'Excellent course! Very detailed and practical.',
        'Great content and well-structured modules.',
        'Good course, but could use more examples.',
        'Amazing instructor and clear explanations.',
        'Very comprehensive and easy to follow.'
      ];

      return {
        student: student.name,
        rating: student.rating,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: getTimeAgo(new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000))
      };
    });

    const courseAnalytics = {
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        status: course.status,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        price: course.price,
        createdAt: course.createdAt
      },
      overview: {
        totalStudents: totalStudents,
        completionRate: completionRate,
        averageRating: course.rating || 0,
        totalEarnings: earningsStr,
        certificatesIssued: certificatesIssued,
        skillTokensDistributed: course.skillTokens || '0 SKILL'
      },
      trends: {
        enrollment: enrollmentTrend,
        completion: moduleCompletion
      },
      students: studentProgress,
      feedback: feedback,
      performance: {
        engagementRate: Math.floor(Math.random() * 20) + 70, // 70-90%
        averageSessionTime: `${Math.floor(Math.random() * 20) + 25} minutes`,
        dropoffRate: Math.floor(Math.random() * 15) + 5, // 5-20%
        peakStudyHours: ['2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM']
      }
    };

    res.json(courseAnalytics);
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return 'Just now';
  }
};

module.exports = {
  createCourse,
  getCourses,
  getAllCourses,
  getCourseById,
  updateCourse,
  getTeacherCourses,
  enrollCourse,
  deleteCourse,
  getEnrolledCourses,
  getTeacherAnalytics,
  getCourseAnalytics
};
