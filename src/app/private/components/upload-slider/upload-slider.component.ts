import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { IBannerModel, ICover, ILinkable } from '../../models/banner';

@Component({
  selector: 'admin-upload-slider',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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

  constructor(private http: HttpClient, private tostar: ToastrService) {
    this.http.get('./home-banners').subscribe(data => {
      this.bannerData = <IBannerModel[]>data
    })
  }

  updateMetaDate() {
    if (!this.bannerRow && this.bannerRow != 0)
      return this.tostar.error('', 'Please select banner row');

    return this.http.post('./home-banners', { "banner_data": (this.bannerData as [])[this.bannerRow], "banner_row": this.bannerRow }).subscribe((response: any) => {
      this.tostar.success('', response.message)
    })
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
    console.log(target.value);
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

  uploadImage(file: File) {
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

  setImageCover(mainCover: HTMLElement, url: string) {
    mainCover.style.display = 'block'
    mainCover.querySelector('img')!.src = url
  }

  clear(event: Event) {
    const target = <HTMLElement>(<HTMLInputElement>event.target)?.closest('span[delete]')
    const parent = target.parentElement;

    (parent!.querySelector('img') as HTMLImageElement).src = '';
    (parent!.querySelector('input') as HTMLInputElement).value = '';
    (parent!.querySelector('div[image-cover]') as HTMLElement).style.display = 'none'

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
      const index = this.bannerData[this.bannerRow]?.linkable?.findIndex(res => res.key == key)
      if (index && index != -1)
        target.value == '' ? delete this.bannerData[this.bannerRow].linkable[index] :
          this.bannerData[this.bannerRow].linkable[index] = { key: key, value: target.value };
      else if (!this.bannerData[this.bannerRow]?.linkable)
        this.bannerData[this.bannerRow]['linkable'] = [{ key: key, value: target.value }]
      else if (target.value != '')
        this.bannerData[this.bannerRow].linkable.push({ key: key, value: target.value })

    }
    this.updateMetaDate()
  }
  save() {
    this.http.get('/move-to-work-dir').subscribe({
      next: (res: any) => { this.tostar.success(res.message) }
    })
  }
}

