export interface IVideo {
  _id?: string;
  url: string;
  title: string;
  subtitle: string;
  description: string;
  parentContent: string;
  createdAt?: Date;
  updatedAt?: Date;
}
