import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { WorkplacesService } from '~/app/core/services/manager/workplaces.service';
import { AppsService } from '~/app/core/services/manager/apps.service';
import { TranslateService } from '@ngx-translate/core';

declare const echarts: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoadingButton: boolean = false;
  dataWorkplaces: any[] = [];
  fromDateToDate: any[] = [];

  workplaceIds: any[] = [];
  dataStatistic: any;
  constructor(
    public authService: AuthService,
    public workplacesService: WorkplacesService,
    public appsService: AppsService,
    public toast: ToastrService,
    public translate: TranslateService,
    ) {
    //this.authService.checkMenu('home');
    //his.authService.checkToken();
  }
  async ngOnInit() {
    this.getWorkplacesData();
    this.onWorkplacesChange();
  }

  getWorkplacesData() {
    this.workplacesService.GetListWorkplacesAsTree()
      .subscribe((res: any) => {
        if(res.code == 1)
        {
          this.dataWorkplaces = res.data;
          if (this.dataWorkplaces) {
            this.dataWorkplaces.forEach((element) => {
              this.workplacesService.setWorkplacesTree(element, 'DISABLED');
            });
          }
        }
      }, error => {
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  getStatisticDashboard(dataPrams: any) {
    if(!dataPrams){
      dataPrams = {
        wpIds: [1,2,3]
      };
    }

    this.appsService.getStatisticDashboard(dataPrams)
      .subscribe((res: any) => {
        if(res.code === 1)
        {
          this.dataStatistic = res.data;
          this.statisticChart();
        }else
          this.toast.warning(res.message);
      }, error => {
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  statisticChart() {
    //init data
    let numberWp = this.dataStatistic.workplaces.length;
    let source = this.dataStatistic.workplaces.map((e) => ({
      'workplace': numberWp <= 3 ? e.wpName : e.wpCode,
      'Ứng dụng': e.countApp,
      'Tải xuống': e.numberDownloads,
      'Người dùng': e.countUser,
    }));

    let chartDom = document.getElementById('statisticChart');
    let myChart = echarts.init(chartDom);

    let option = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['workplace', 'Ứng dụng', 'Tải xuống', 'Người dùng'],
        source: source
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        { 
          name: 'Ứng dụng',
          type: 'bar',
          barWidth: '10%',
          label: {
            show: true,
            position: 'inside'
          }
        }, 
        { 
          name: 'Tải xuống',
          type: 'bar',
          barWidth: '10%',
          label: {
            show: true,
            position: 'inside'
          }
        }, 
        { 
          name: 'Người dùng',
          type: 'bar',
          barWidth: '10%',
          label: {
            show: true,
            position: 'inside'
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  onWorkplacesChange() {
    setTimeout(() => {
      if(this.workplaceIds.length === 0){
        this.getStatisticDashboard(null);
      }else{
        const dataParam = {
          wpIds: this.workplaceIds
        }
        this.getStatisticDashboard(dataParam);
      }
    }, 0);
  }
}
