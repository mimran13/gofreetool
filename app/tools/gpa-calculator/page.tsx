'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

export default function GPACalculator() {
  const tool = getToolBySlug('gpa-calculator');
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Course 1', credits: 3, grade: 'A' },
    { id: '2', name: 'Course 2', credits: 3, grade: 'B+' },
    { id: '3', name: 'Course 3', credits: 4, grade: 'A-' },
  ]);

  const results = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      if (course.credits > 0 && gradePoints[course.grade] !== undefined) {
        totalCredits += course.credits;
        totalPoints += course.credits * gradePoints[course.grade];
      }
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      gpa,
      totalCredits,
      totalPoints,
    };
  }, [courses]);

  const addCourse = useCallback(() => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: `Course ${courses.length + 1}`, credits: 3, grade: 'A' },
    ]);
  }, [courses]);

  const removeCourse = useCallback((id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  }, [courses]);

  const updateCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }, [courses]);

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gpa >= 2.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Calculate your <strong>Grade Point Average (GPA)</strong> from your course grades and credit hours.
          Add all your courses to see your cumulative GPA on a 4.0 scale.
          <strong> All calculations happen in your browser</strong> — your grades stay private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Your Courses</h3>
          <button
            onClick={addCourse}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            + Add Course
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {courses.map((course) => (
            <div key={course.id} className="flex gap-3 items-center">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder="Course name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                min="0"
                max="10"
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 text-center"
                placeholder="Credits"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              >
                {Object.keys(gradePoints).map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(course.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
              <div className={`text-4xl font-bold ${getGPAColor(results.gpa)}`}>
                {results.gpa.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Your GPA</div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.totalCredits}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits</div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.totalPoints.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Grade Point Values</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-sm text-blue-700 dark:text-blue-400">
          {Object.entries(gradePoints).map(([grade, points]) => (
            <span key={grade}>{grade} = {points.toFixed(1)}</span>
          ))}
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter each course name (optional, for your reference)</li>
          <li>Set the credit hours for each course</li>
          <li>Select the grade you received</li>
          <li>Add more courses as needed</li>
          <li>See your cumulative GPA calculated automatically</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
