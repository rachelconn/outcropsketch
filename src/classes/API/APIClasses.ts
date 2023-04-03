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

export interface StudentSubmission {
  id: string,
  ownerFirstName: string,
  ownerLastName: string,
  createdAt: string,
}

export type GetRolesAPIReturnType = Roles;

export type ListCoursesAPIReturnType = CourseProps[];

export type GetCourseInfoAPIReturnType = CourseProps;

export type ListSubmissionsAPIReturnType = StudentSubmission[];
