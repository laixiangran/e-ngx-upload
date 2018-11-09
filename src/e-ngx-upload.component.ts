import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
	selector: 'e-ngx-upload',
	templateUrl: './e-ngx-upload.component.html',
	styleUrls: ['./e-ngx-upload.component.scss']
})
export class ENgxUploadComponent implements OnInit {
	itemList = [];
	fileLength = 0;
	isDragIn = false;
	droped = false;
	standChunk = 1024 * 1024 * 10;

	constructor() {
	}

	ngOnInit() {

		// 禁用掉 document 的默认 dragover 事件行为
		document.addEventListener('dragover', (ev) => {
			this.droped = false;
			ev.preventDefault();
		}, false);
	}

	dropHandler(ev) {
		this.droped = true;
		this.fileLength += ev.dataTransfer.files.length;
		Array.from(ev.dataTransfer.files).forEach((file) => {
			let obj: any;
			this.md5(file).then((data: any) => {
				obj = data;
				const chunkCount = Math.ceil(obj.file.size / this.standChunk);
				const chunksArr = [];
				for (let j = 0; j < chunkCount; j++) {
					chunksArr.push((obj.file.slice(j * this.standChunk, (j + 1) * this.standChunk)));
				}
				obj.chunks = chunksArr;

				// 默认按md5存分片
				const res = JSON.parse(localStorage.getItem(obj.md5));
				if (JSON.stringify(res) === '{}' || !res) {
					const localObj = {
						nextTimes: 2,
						uploadedChunks: [],
						totalTimes: chunkCount,
						loaded: 0,
						times: 0
					};
					obj.times = 0;
					obj.loaded = 0;
					localStorage.setItem(obj.md5, JSON.stringify(localObj));
				} else {
					obj.loaded = res.loaded;
					obj.times = res.times;
				}
				this.itemList.push(obj);
			});
		});
		ev.preventDefault();
	}

	dragleaveHandler() {
		this.isDragIn = false;
		this.droped = false;
	}

	dragenterHandler() {
		this.isDragIn = true;
		this.droped = false;
	}

	md5(file): Promise<any> {
		return new Promise<any>((resolve) => {
			const fileReader = new FileReader(),
				blobSlice = File.prototype.slice,
				chunkSize = 2097152,
				chunks = Math.ceil(file.size / chunkSize),
				md5 = new Md5();
			let currentChunk = 0;
			fileReader.onload = (e) => {
				md5.appendStr(e.target['result']);
				currentChunk++;
				if (currentChunk < chunks) {
					loadNext();
				} else {
					resolve({md5: md5.end(), file: file});
				}
			};

			loadNext();

			function loadNext() {
				const start = currentChunk * chunkSize,
					end = start + chunkSize >= file.size ? file.size : start + chunkSize;
				fileReader.readAsBinaryString(blobSlice.call(file, start, end));
			}
		});
	}
}
