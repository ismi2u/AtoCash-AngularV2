import { RoleFormComponent } from './role-form/role-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { RoleComponent } from './role.component';
import { RolelistComponent } from './role-list/role-list.component';


const routes: Routes = [{
  path: '', component: RoleComponent,
  children: [
    {
      path: 'list',
      component: RolelistComponent,
    }, 
    {
      path: 'action/:type',
      component: RoleFormComponent,
    },
    {
      path: 'action/:type/:id',
      component: RoleFormComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' },


  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
