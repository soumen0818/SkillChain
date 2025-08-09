
const Course = require('../models/Course');

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

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: { $ne: 'draft' } }).populate('teacher', 'username email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'username email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'username email');
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
    ).populate('teacher', 'username email');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }).populate('teacher', 'username email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Check if user is already enrolled
      if (course.students.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      course.students.push(req.user._id);
      await course.save();
      res.json({ message: 'Enrolled successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
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

module.exports = {
  createCourse,
  getCourses,
  getAllCourses,
  getCourseById,
  updateCourse,
  getTeacherCourses,
  enrollCourse,
  deleteCourse
};
