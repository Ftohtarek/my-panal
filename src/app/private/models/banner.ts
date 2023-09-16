export interface IBannerModel {
  linkable: ILinkable[]
  page: string,
  rondomKey: any
  cover: ICover
}
export interface ILinkable {
  key: string,
  value: any | null
}
export interface ICover {
  mobileEn: string,
  mobileAr: string,
  desktopEn: string,
  desktopAr: string,
}
