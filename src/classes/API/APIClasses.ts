interface Roles {
  instructor: boolean,
  student: boolean,
  researcher: boolean,
}

export interface LabeledImageProps {
  id: string,
  name: string,
  createdAt: string,
  jsonFile: string,
  thumbnail: string,
}

export interface CourseProps {
  courseCode: number,
  description: string,
  title: string,
  owner: boolean,
  labeledImages: LabeledImageProps[],
}

export type GetRolesAPIReturnType = Roles;

export type ListCoursesAPIReturnType = CourseProps[];

export type GetCourseInfoAPIReturnType = CourseProps;
