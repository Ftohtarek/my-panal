import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IBannerModel, ICover, ILinkable } from '../../models/banner';

@Component({
  selector: 'admin-upload-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-slider.component.html',
  styleUrls: ['./upload-slider.component.scss']
})
export class UploadSliderComponent {
  selectedFile: File | null = null;
  bannerRow!: number;
  bannerData?: IBannerModel[]
  linkable: ILinkable[] = [{ key: 'categories', value: null }, { key: 'brands', value: null }, { key: 'collections', value: null }, { key: 'priceTo', value: null }, { key: 'priceFrom', value: null }]
  covers: ICover = { desktopAr: '', desktopEn: '', mobileAr: '', mobileEn: '' }
  coverKeys = Object.keys(this.covers)

  distination = 0
  constructor(private http: HttpClient, private tostar: ToastrService) { }

  selectDestination(event: Event) {
    const target = <HTMLSelectElement>event.target
    this.http.post('./destination', { distination: target.value }).subscribe({
      next: (res: any) => {
        this.distination = Number(target.value)
        this.tostar.success('', res.message)
        this.getBanners()

      }
    })
  }

  getBanners() {
    this.http.get('./home-banners').subscribe(data => {
      this.bannerData = <IBannerModel[]>data
    })
  }

  updateMetaDate() {
    if (!this.bannerRow && this.bannerRow != 0)
      return this.tostar.error('', 'Please select banner row');

    if (!this.can()) return

    return this.http.post('./home-banners', { "banner_data": (this.bannerData as [])[this.bannerRow], "banner_row": this.bannerRow }).subscribe((response: any) => {
      this.tostar.success('', response.message)
    })
  }

  uploadImage(file: File) {
    if (!this.can()) return

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post('/upload', formData).subscribe({
        next: (response: any) => {
          this.tostar.success('', response.message)
        }
      }
      );
    }
  }

  updateBannerImageName(file: File, coverName: string) {
    if (this.bannerData) {
      this.bannerData[this.bannerRow]['cover'] = { ...this.covers, ...this.bannerData[this.bannerRow]['cover'] }
      this.bannerData[this.bannerRow]['cover'][<keyof ICover>coverName] = file.name;
    }
    this.updateMetaDate()
  }

  selectRow(event: Event) {
    const target = <HTMLSelectElement>event.target
    this.clearAllImage()
    if (!this.can()) {
      this.tostar.error('', 'please select a destination first')
      target.value = ''
      this.clearAllImage()
    }

    if (!this.can()) return
    this.bannerRow = Number(target.value)
  }

  checkIfRowSelected() {
    if (!this.bannerRow)
      this.tostar.error('', 'Please select banner row');
  }

  onFileSelected(event: any) {
    const target: HTMLInputElement = event.target
    const file = this.destructFile(event);
    console.log(file);
    this.readFile(file, (url) => {
      this.setImageCover(target.parentElement?.querySelector('div[image-cover]') as HTMLElement, url)
    })
    this.updateBannerImageName(file, target.name)
    this.uploadImage(file)
  }

  destructFile(event: any) {
    const target: HTMLInputElement = event.target
    const file: File = (target.files as any)[0]

    const fileExtension = file?.name.split('.').pop();
    const imgName = 'banner' + this.bannerRow + target.name + '.' + fileExtension
    console.log(imgName);
    return new File([file], imgName, { type: file?.type });
  }

  readFile(file: File, patchSrc = (url: string) => { }) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      patchSrc(url)
    };
    return reader.readAsDataURL(file);
  }

  setImageCover(mainCover: HTMLElement, url: string) {
    mainCover.style.display = 'block'
    mainCover.querySelector('img')!.src = url
  }

  clear(event: Event) {
    const target = <HTMLElement>(<HTMLInputElement>event.target)?.closest('span[delete]')
    const parent = target.parentElement;
    this.clearImage(<HTMLElement>parent)
  }

  clearAllImage() {
    let imagesContainer = document.querySelectorAll('.drop-container')
    imagesContainer.forEach(container => {
      this.clearImage(<HTMLElement>container, false)
    })
  }
  clearImage(parent: HTMLElement, anotation: boolean = true) {
    (parent!.querySelector('img') as HTMLImageElement).src = '';
    (parent!.querySelector('input') as HTMLInputElement).value = '';
    (parent!.querySelector('div[image-cover]') as HTMLElement).style.display = 'none'
    if (anotation)
      this.tostar.warning('', 'Filed is Clearing')
  }

  banner(bannerRow: number) {
    if (this.bannerData)
      return this.bannerData[bannerRow]
    return undefined
  }

  activeLabel(event: Event) {
    const target = <HTMLElement>event.target
    target.classList.add('active')
  }

  checkActivation(event: Event) {
    const target = <HTMLElement>event.target
    target.nodeValue ?? target.nextElementSibling?.classList.remove('active')
  }

  hasValue(link: ILinkable) {
    if (this.bannerData) {
      let linkObj = this.bannerData[this.bannerRow]?.linkable?.find(res => res.key == link.key)
      return linkObj ? true : false
    }
    return false
  }

  getValue(link: ILinkable): ILinkable {
    if (this.bannerData) {
      let linkObj = <ILinkable>this.bannerData[this.bannerRow].linkable.find(res => res.key == link.key)
      return linkObj
    }
    return <ILinkable>{}

  }

  updatePage(event: Event) {
    const target = <HTMLSelectElement>event.target
    if (this.bannerData)
      this.bannerData[this.bannerRow] = { ...this.bannerData[this.bannerRow], page: target.value }
    this.updateMetaDate()

  }

  updateLink(key: string, event: Event) {
    const target = <HTMLInputElement>event.target
    if (this.bannerData) {
      const { bannerData, bannerRow } = this; // Destructure the object for easier access
      const linkableArray = bannerData[bannerRow]?.linkable || [];

      const index = linkableArray.findIndex(res => res.key === key);
      const newLinkable = { key: key, value: target.value };

      if (index !== -1) {
        if (target.value === '') {
          linkableArray.splice(index, 1);
        } else {
          linkableArray[index] = newLinkable;
        }
      } else if (target.value !== '') {
        linkableArray.push(newLinkable);
      }

      bannerData[bannerRow] = { ...bannerData[bannerRow], linkable: linkableArray };
    }
    this.updateMetaDate()
  }

  save() {
    this.http.get('/move-to-work-dir').subscribe({
      next: (res: any) => { this.tostar.success(res.message) }
    })
  }

  can() {
    return this.distination ? true : false
  }
}

