interface Roles {
  instructor: boolean,
  student: boolean,
  researcher: boolean,
}

export interface CourseProps {
  courseCode: number,
  description: string,
  title: string,
  owner: boolean,
}

export type GetRolesAPIReturnType = Roles;

export type ListCoursesAPIReturnType = CourseProps[];

export type GetCourseInfoAPIReturnType = CourseProps;
