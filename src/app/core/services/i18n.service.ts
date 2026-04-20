import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private _currentLang: 'es' | 'pt' = 'es';

  private readonly dictionary: Record<'es' | 'pt', Record<string, string>> = {
    es: {
      'App_Title': 'Calculadora Emprendedora',
      'App_Subtitle': 'Papelería · Manualidades · Bisutería',
      'Btn_Demo': '✨ Cargar Ejemplo',
      'Btn_New': 'Nuevo Proyecto',
      'Btn_Save_Local': 'Guardar en PC',
      'Btn_Export_CSV': 'Excel / CSV',
      'Btn_Add_Material': 'Añadir Material',
      'Btn_Add_Insumo': 'Añadir Insumo',
      'Btn_Add_Task': 'Añadir Tarea',
      'Btn_Add_Software': 'Añadir Programa',
      'Btn_Add_Machine': 'Añadir Máquina',
      'Btn_Add_Tapete': 'Añadir Desgaste Tapete',
      'Tab_Materials': 'Materiales',
      'Tab_Insumos': 'Insumos y Tiempo',
      'Tab_Workshop': 'Mi Taller',
      'Rail_MyProjects': 'Mis presupuestos',
      'Rail_Empty': 'Sin presupuestos aún',
      'Rail_Tools': 'Herramientas Externas',
      'Rail_Export': 'Exportar Backup',
      'Rail_Import': 'Importar Backup',
      'Label_Unidades': 'Unidades a producir',
      'Label_Materials': 'Materiales',
      'Label_Insumos': 'Insumos',
      'Label_Labor': 'Mano de Obra',
      'Label_Tapetes': 'Tapetes',
      'Label_Software_Fixed': 'Software & Fijos',
      'Label_Machines': 'Máquinas',
      'Label_Total_Cost': 'Costo TOTAL',
      'Label_Suggested_PVP': 'PVP RECOMENDADO',
      'Label_Per_Unit': 'por unidad',
      'Help_Materials': 'Define cómo usas tus materiales. Los retazos que no sirven se cuentan como Hoja Completa.',
      'Section_Tapetes': 'Tapetes de Corte (Desgaste)',
      'Section_Insumos': 'Insumos y Consumibles',
      'Section_Labor': 'Mano de Obra',
      'Section_Software': 'Programas y Suscripciones (Design Space, Adobe, Canva...)',
      'Section_Depr': 'Equipos y Máquinas (Depreciación)',
      'Placeholder_ProjectName': 'Nombre del proyecto...',
      'Placeholder_MaterialName': 'Nombre del material (ej: Cartulina Escarchada)',
      'Placeholder_SoftwareName': 'Ej: Cricut Access, Illustrator...',
      'Placeholder_MachineName': 'Ej: Cricut Maker 3',
      'Type_Sheet': '🟩 Hoja Completa',
      'Type_Area': '✂️ Recorte / Área',
      'Type_Unit': '🔢 Por Unidad',
      'Type_Package': '📦 Por Paquete',
      'Type_Pot': '🧴 Bote/Tubo',
      'Type_Meter': '📏 Por Metro',
      'Type_Weight': '⚖️ Por Peso',
      'Field_Price': 'Precio Compra',
      'Field_Waste': '% Merma',
      'Field_Sheets_Pack': 'Hojas en pack',
      'Field_Sheets_Used': 'Hojas usadas',
      'Field_Total_Content': 'Contenido Total',
      'Field_Used': 'Usado',
      'Field_Type': 'Tipo de Material',
      'Field_Useful_Life': 'Vida Útil (años)',

      'Field_Usage_Hours': 'Uso mensual (horas)',
      'Config_Title_Labor': 'Mano de Obra',
      'Config_Salary': 'Sueldo mensual objetivo',
      'Config_Hours': 'Horas trabajo/semana',
      'Config_Value_Hour': 'Tu Valor Hora',
      'Config_Title_Fixed': 'Gastos Fijos',
      'Config_Fixed_Help': 'Se sumará proporcionalmente al tiempo de cada proyecto.',
      'Config_Title_Profit': 'Ganancia',
      'Config_Profit_Label': '% Margen sobre costo (Profit)',
      'Config_Regional': 'Configuración Regional',
      'Config_Language': 'Idioma',
      'Config_Currency': 'Moneda',
      'Time_Total': 'Tiempo total',
      'Time_Cost': 'Costo',
      'Machine_Hour_Cost': 'Desgaste por hora de uso',
      'Confirm_Delete': '¿Eliminar presupuesto "[name]"?',
      'Btn_Save': 'Guardar',
      'Btn_Excel': 'Excel',
      'Msg_Saved': '✅ Presupuesto guardado correctamente',

      'Msg_Config_Saved': '⚙️ Configuración guardada',
      'Msg_Import_Success': '✅ Datos importados correctamente',
      'Summarize_Title': 'Desglose de Costos',
      'Hecho_Por': 'Hecho por'
    },

    pt: {
      'App_Title': 'Calculadora Empreendedora',
      'App_Subtitle': 'Papelaria · Artesanato · Bijuteria',
      'Btn_Demo': '✨ Carregar Exemplo',
      'Btn_New': 'Novo Projeto',
      'Btn_Save_Local': 'Salvar no PC',
      'Btn_Export_CSV': 'Excel / CSV',
      'Btn_Add_Material': 'Adicionar Material',
      'Btn_Add_Insumo': 'Adicionar Insumo',
      'Btn_Add_Task': 'Adicionar Tarefa',
      'Btn_Add_Software': 'Adicionar Programa',
      'Btn_Add_Machine': 'Adicionar Máquina',
      'Btn_Add_Tapete': 'Adicionar Desgaste Base',
      'Tab_Materials': 'Materiais',
      'Tab_Insumos': 'Insumos e Tempo',
      'Tab_Workshop': 'Minha Oficina',
      'Rail_MyProjects': 'Meus Orçamentos',
      'Rail_Empty': 'Sem orçamentos ainda',
      'Rail_Tools': 'Ferramentas Externas',
      'Rail_Export': 'Exportar Backup',
      'Rail_Import': 'Importar Backup',
      'Label_Unidades': 'Unidades a produzir',
      'Label_Materials': 'Materiais',
      'Label_Insumos': 'Insumos',
      'Label_Labor': 'Mão de Obra',
      'Label_Tapetes': 'Bases de Corte',
      'Label_Software_Fixed': 'Software & Fixos',
      'Label_Machines': 'Máquinas',
      'Label_Total_Cost': 'Custo TOTAL',
      'Label_Suggested_PVP': 'PVP RECOMENDADO',
      'Label_Per_Unit': 'por unidade',
      'Help_Materials': 'Defina como você usa seus materiais. Retalhos que não servem contam como Folha Completa.',
      'Section_Tapetes': 'Bases de Corte (Desgaste)',
      'Section_Insumos': 'Insumos e Consumíveis',
      'Section_Labor': 'Mão de Obra',
      'Section_Software': 'Programas e Assinaturas (Design Space, Adobe, Canva...)',
      'Section_Depr': 'Equipamentos e Máquinas (Depreciação)',
      'Placeholder_ProjectName': 'Nome do projeto...',
      'Placeholder_MaterialName': 'Nome do material (ex: Cartolina Glitter)',
      'Placeholder_SoftwareName': 'Ex: Cricut Access, Illustrator...',
      'Placeholder_MachineName': 'Ex: Cricut Maker 3',
      'Type_Sheet': '🟩 Folha Completa',
      'Type_Area': '✂️ Recorte / Área',
      'Type_Unit': '🔢 Por Unidade',
      'Type_Package': '📦 Por Pacote',
      'Type_Pot': '🧴 Pote/Tubo',
      'Type_Meter': '📏 Por Metro',
      'Type_Weight': '⚖️ Por Peso',
      'Field_Price': 'Preço de Compra',
      'Field_Waste': '% Perda',
      'Field_Sheets_Pack': 'Folhas no pack',
      'Field_Sheets_Used': 'Folhas usadas',
      'Field_Total_Content': 'Conteúdo Total',
      'Field_Used': 'Usado',
      'Field_Type': 'Tipo de Material',
      'Field_Useful_Life': 'Vida Útil (anos)',

      'Field_Usage_Hours': 'Uso mensal (horas)',
      'Config_Title_Labor': 'Mão de Obra',
      'Config_Salary': 'Salário mensal objetivo',
      'Config_Hours': 'Horas trabalho/semana',
      'Config_Value_Hour': 'Seu Valor Hora',
      'Config_Title_Fixed': 'Custos Fixos',
      'Config_Fixed_Help': 'Será somado proporcionalmente ao tempo de cada projeto.',
      'Config_Title_Profit': 'Lucro',
      'Config_Profit_Label': '% Margem sobre custo (Lucro)',
      'Config_Regional': 'Configuração Regional',
      'Config_Language': 'Idioma',
      'Config_Currency': 'Moeda',
      'Time_Total': 'Tempo total',
      'Time_Cost': 'Custo',
      'Machine_Hour_Cost': 'Desgaste por hora de uso',
      'Confirm_Delete': 'Excluir orçamento "[name]"?',
      'Btn_Save': 'Salvar',
      'Btn_Excel': 'Excel',
      'Msg_Saved': '✅ Orçamento salvo com sucesso',

      'Msg_Config_Saved': '⚙️ Configuração salva',
      'Msg_Import_Success': '✅ Datos importados com sucesso',
      'Summarize_Title': 'Resumo de Custos',
      'Hecho_Por': 'Feito por'
    }
  };

  private readonly currencies: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'BRL': 'R$',
    'CLP': '$ (CLP)',
    'COP': '$ (COP)',
    'ARS': '$ (ARS)',
    'VES': 'Bs.',
    'PEN': 'S/'
  };

  setLanguage(lang: 'es' | 'pt') {
    this._currentLang = lang;
  }

  get currentLang() {
    return this._currentLang;
  }

  t(key: string, params?: Record<string, string>): string {
    let text = this.dictionary[this._currentLang][key] || key;
    if (params) {
      Object.keys(params).forEach(p => {
        text = text.replace(`[${p}]`, params[p]);
      });
    }
    return text;
  }

  getCurrencySymbol(code: string): string {
    return this.currencies[code] || '€';
  }

  getAvailableCurrencies(): string[] {
    return Object.keys(this.currencies);
  }
}
