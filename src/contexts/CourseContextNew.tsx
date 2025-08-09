import React, { createContext, useContext, useState, useEffect } from 'react';
import { courseAPI } from '@/lib/api';

export interface Course {
    _id?: string;
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: string;
    skillTokenReward: string;
    prerequisites: string[];
    learningOutcomes: string[];
    thumbnail: string | null;
    status: 'draft' | 'active' | 'paused';
    students: number;
    rating: number;
    reviews: number;
    completion: number;
    earnings: string;
    skillTokens: string;
    lastUpdated: string;
    modules: number;
    totalLessons: number;
    certificates: number;
    enrollmentTrend: string;
    createdAt: string;
    teacherId: string;
    curriculum?: any[]; // Course curriculum/modules
    syllabus?: any[];
    teacher?: {
        _id: string;
        username: string;
        email: string;
    };
}

interface CourseContextType {
    courses: Course[];
    loading: boolean;
    error: string | null;
    addCourse: (courseData: any) => Promise<string>;
    updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
    getCourseById: (courseId: string) => Course | undefined;
    getTeacherCourses: (teacherId: string) => Course[];
    deleteCourse: (courseId: string) => Promise<void>;
    refreshCourses: () => Promise<void>;
    enrollInCourse: (courseId: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error('useCourses must be used within a CourseProvider');
    }
    return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load courses from API on mount
    useEffect(() => {
        refreshCourses();
    }, []);

    const refreshCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const coursesData = await courseAPI.getAll();
            // Transform backend course data to frontend format
            const transformedCourses = coursesData.map((course: any) => ({
                id: course._id,
                _id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                duration: course.duration,
                price: course.price,
                skillTokenReward: course.skillTokenReward,
                prerequisites: course.prerequisites || [],
                learningOutcomes: course.learningOutcomes || [],
                thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop',
                status: course.status,
                students: course.students ? course.students.length : 0,
                rating: course.rating || 0,
                reviews: course.reviews || 0,
                completion: 0, // Calculate based on enrollment data if available
                earnings: course.earnings || '0 ETH',
                skillTokens: course.skillTokens || '0 SKILL',
                lastUpdated: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'Recently',
                modules: course.modules || 0,
                totalLessons: course.totalLessons || 0,
                certificates: course.certificates || 0,
                enrollmentTrend: course.enrollmentTrend || '+0%',
                createdAt: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '',
                teacherId: course.teacher?._id || course.teacher,
                curriculum: course.syllabus || [],
                syllabus: course.syllabus || [],
                teacher: course.teacher,
            }));
            setCourses(transformedCourses);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to load courses:', err);
            // Fallback to default courses for demo
            const defaultCourses: Course[] = [
                {
                    id: '1',
                    title: 'Blockchain Fundamentals',
                    description: 'Learn the fundamentals of blockchain technology, including cryptography, consensus mechanisms, and smart contracts.',
                    category: 'Blockchain Development',
                    level: 'Beginner',
                    duration: '8 weeks',
                    price: '0.1',
                    skillTokenReward: '100',
                    prerequisites: ['Basic programming knowledge', 'Understanding of digital currencies'],
                    learningOutcomes: ['Understand blockchain architecture', 'Learn cryptographic principles', 'Build simple smart contracts'],
                    thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=300&h=200&fit=crop',
                    status: 'active',
                    students: 45,
                    rating: 4.8,
                    reviews: 23,
                    completion: 89,
                    earnings: '2.3 ETH',
                    skillTokens: '250 SKILL',
                    lastUpdated: '2 days ago',
                    modules: 8,
                    totalLessons: 24,
                    certificates: 38,
                    enrollmentTrend: '+12%',
                    createdAt: '2024-01-15',
                    teacherId: 'teacher1'
                },
                {
                    id: '2',
                    title: 'Advanced Smart Contracts',
                    description: 'Deep dive into advanced smart contract development with Solidity and security best practices.',
                    category: 'Smart Contracts',
                    level: 'Advanced',
                    duration: '12 weeks',
                    price: '0.2',
                    skillTokenReward: '200',
                    prerequisites: ['Blockchain Fundamentals', 'Solidity basics', 'Web3 development experience'],
                    learningOutcomes: ['Master advanced Solidity patterns', 'Implement security measures', 'Deploy production contracts'],
                    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
                    status: 'active',
                    students: 32,
                    rating: 4.9,
                    reviews: 18,
                    completion: 76,
                    earnings: '3.1 ETH',
                    skillTokens: '180 SKILL',
                    lastUpdated: '5 days ago',
                    modules: 12,
                    totalLessons: 36,
                    certificates: 24,
                    enrollmentTrend: '+8%',
                    createdAt: '2024-02-20',
                    teacherId: 'teacher1'
                },
            ];
            setCourses(defaultCourses);
            localStorage.setItem('skillchain_courses', JSON.stringify(defaultCourses));
        } finally {
            setLoading(false);
        }
    };

    const addCourse = async (courseData: any): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            // Prepare course data for API
            const apiCourseData = {
                title: courseData.title,
                description: courseData.description,
                category: courseData.category,
                level: courseData.level,
                duration: courseData.duration,
                price: courseData.price,
                skillTokenReward: courseData.skillTokenReward,
                prerequisites: courseData.prerequisites || [],
                learningOutcomes: courseData.learningOutcomes || [],
                thumbnail: courseData.thumbnail || null,
                syllabus: courseData.syllabus || [],
                status: courseData.status || 'draft',
            };

            const createdCourse = await courseAPI.create(apiCourseData);

            // Transform and add to local state
            const transformedCourse: Course = {
                id: createdCourse._id,
                _id: createdCourse._id,
                title: createdCourse.title,
                description: createdCourse.description,
                category: createdCourse.category,
                level: createdCourse.level,
                duration: createdCourse.duration,
                price: createdCourse.price,
                skillTokenReward: createdCourse.skillTokenReward,
                prerequisites: createdCourse.prerequisites || [],
                learningOutcomes: createdCourse.learningOutcomes || [],
                thumbnail: createdCourse.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop',
                status: createdCourse.status,
                students: 0,
                rating: 0,
                reviews: 0,
                completion: 0,
                earnings: '0 ETH',
                skillTokens: '0 SKILL',
                lastUpdated: 'Just created',
                modules: createdCourse.modules || 0,
                totalLessons: createdCourse.totalLessons || 0,
                certificates: 0,
                enrollmentTrend: '+0%',
                createdAt: new Date().toLocaleDateString(),
                teacherId: createdCourse.teacher,
                curriculum: createdCourse.syllabus || [],
                syllabus: createdCourse.syllabus || [],
                teacher: createdCourse.teacher,
            };

            setCourses(prev => [...prev, transformedCourse]);

            // Also save to localStorage as backup
            const updatedCourses = [...courses, transformedCourse];
            localStorage.setItem('skillchain_courses', JSON.stringify(updatedCourses));

            return createdCourse._id;
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to create course:', err);

            // Fallback to localStorage only
            const newCourse: Course = {
                ...courseData,
                id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'draft',
                students: 0,
                rating: 0,
                reviews: 0,
                completion: 0,
                earnings: '0 ETH',
                skillTokens: '0 SKILL',
                lastUpdated: 'Just created',
                certificates: 0,
                enrollmentTrend: '+0%',
                createdAt: new Date().toISOString().split('T')[0],
                thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop'
            };

            setCourses(prev => [...prev, newCourse]);
            localStorage.setItem('skillchain_courses', JSON.stringify([...courses, newCourse]));
            return newCourse.id;
        } finally {
            setLoading(false);
        }
    };

    const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await courseAPI.update(courseId, updates);

            setCourses(prev =>
                prev.map(course =>
                    course.id === courseId || course._id === courseId
                        ? { ...course, ...updates, lastUpdated: 'Just updated' }
                        : course
                )
            );

            // Update localStorage backup
            const updatedCourses = courses.map(course =>
                course.id === courseId || course._id === courseId
                    ? { ...course, ...updates, lastUpdated: 'Just updated' }
                    : course
            );
            localStorage.setItem('skillchain_courses', JSON.stringify(updatedCourses));
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to update course:', err);

            // Fallback to localStorage only
            setCourses(prev =>
                prev.map(course =>
                    course.id === courseId || course._id === courseId
                        ? { ...course, ...updates, lastUpdated: 'Just updated' }
                        : course
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const getCourseById = (courseId: string): Course | undefined => {
        return courses.find(course => course.id === courseId || course._id === courseId);
    };

    const getTeacherCourses = (teacherId: string): Course[] => {
        return courses.filter(course => course.teacherId === teacherId);
    };

    const deleteCourse = async (courseId: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await courseAPI.delete(courseId);
            setCourses(prev => prev.filter(course => course.id !== courseId && course._id !== courseId));

            // Update localStorage backup
            const updatedCourses = courses.filter(course => course.id !== courseId && course._id !== courseId);
            localStorage.setItem('skillchain_courses', JSON.stringify(updatedCourses));
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to delete course:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const enrollInCourse = async (courseId: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await courseAPI.enroll(courseId);

            // Update local course data to reflect enrollment
            setCourses(prev =>
                prev.map(course =>
                    course.id === courseId || course._id === courseId
                        ? { ...course, students: course.students + 1 }
                        : course
                )
            );
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to enroll in course:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CourseContext.Provider value={{
            courses,
            loading,
            error,
            addCourse,
            updateCourse,
            getCourseById,
            getTeacherCourses,
            deleteCourse,
            refreshCourses,
            enrollInCourse,
        }}>
            {children}
        </CourseContext.Provider>
    );
};
