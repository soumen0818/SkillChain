import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Course {
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
}

interface CourseContextType {
  courses: Course[];
  addCourse: (courseData: Omit<Course, 'id' | 'createdAt' | 'status' | 'students' | 'rating' | 'reviews' | 'completion' | 'earnings' | 'skillTokens' | 'lastUpdated' | 'certificates' | 'enrollmentTrend'>) => string;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getTeacherCourses: (teacherId: string) => Course[];
  deleteCourse: (courseId: string) => void;
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

  // Load courses from localStorage on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('skillchain_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // Initialize with default courses for demo
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
          completion: 92,
          earnings: '1.8 ETH',
          skillTokens: '180 SKILL',
          lastUpdated: '1 week ago',
          modules: 12,
          totalLessons: 36,
          certificates: 29,
          enrollmentTrend: '+8%',
          createdAt: '2024-02-20',
          teacherId: 'teacher1'
        },
        {
          id: '3',
          title: 'DeFi Protocol Development',
          description: 'Build decentralized finance protocols and understand the DeFi ecosystem.',
          category: 'DeFi',
          level: 'Intermediate',
          duration: '10 weeks',
          price: '0.15',
          skillTokenReward: '150',
          prerequisites: ['Smart contract knowledge', 'Financial protocols understanding'],
          learningOutcomes: ['Build DeFi protocols', 'Understand liquidity mechanisms', 'Implement yield farming'],
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop',
          status: 'draft',
          students: 28,
          rating: 4.7,
          reviews: 15,
          completion: 0,
          earnings: '1.2 ETH',
          skillTokens: '120 SKILL',
          lastUpdated: '3 days ago',
          modules: 10,
          totalLessons: 30,
          certificates: 0,
          enrollmentTrend: '+5%',
          createdAt: '2024-03-10',
          teacherId: 'teacher1'
        },
        {
          id: '4',
          title: 'NFT Marketplace Building',
          description: 'Create your own NFT marketplace with advanced features and integrations.',
          category: 'NFTs',
          level: 'Intermediate',
          duration: '6 weeks',
          price: '0.12',
          skillTokenReward: '120',
          prerequisites: ['React knowledge', 'Smart contract basics', 'IPFS understanding'],
          learningOutcomes: ['Build NFT marketplace', 'Integrate with wallets', 'Handle metadata storage'],
          thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
          status: 'paused',
          students: 19,
          rating: 4.6,
          reviews: 12,
          completion: 67,
          earnings: '0.8 ETH',
          skillTokens: '95 SKILL',
          lastUpdated: '1 month ago',
          modules: 6,
          totalLessons: 18,
          certificates: 12,
          enrollmentTrend: '+3%',
          createdAt: '2024-04-05',
          teacherId: 'teacher1'
        }
      ];
      setCourses(defaultCourses);
      localStorage.setItem('skillchain_courses', JSON.stringify(defaultCourses));
    }
  }, []);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('skillchain_courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'status' | 'students' | 'rating' | 'reviews' | 'completion' | 'earnings' | 'skillTokens' | 'lastUpdated' | 'certificates' | 'enrollmentTrend'>): string => {
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
    return newCourse.id;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, ...updates, lastUpdated: 'Just updated' }
          : course
      )
    );
  };

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };

  const getTeacherCourses = (teacherId: string): Course[] => {
    return courses.filter(course => course.teacherId === teacherId);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  return (
    <CourseContext.Provider value={{
      courses,
      addCourse,
      updateCourse,
      getCourseById,
      getTeacherCourses,
      deleteCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};
