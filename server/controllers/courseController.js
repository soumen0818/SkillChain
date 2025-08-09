
const Course = require('../models/Course');

const createCourse = async (req, res) => {
  const { title, description, content } = req.body;
  try {
    const course = new Course({
      title,
      description,
      teacher: req.user._id,
      content,
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('teacher', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'username');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
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

module.exports = { createCourse, getCourses, getCourseById, enrollCourse };
