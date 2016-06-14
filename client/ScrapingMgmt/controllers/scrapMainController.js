app.controller('scrapMainController', function(){
    var vm = this;

    vm.gridOptions.data = [
        {
            'name': 'Lord Of the Rings',
            'email': 'lotr@email.com',
            'company': 'Gandalf',
            'number': '123'
        },
        {
            name: 'Pirates of the Caribbean',
            email: 'potc@pirate.com',
            company: 'Ahoy',
            number: '456'
        },
        {
            name: 'Zootopia',
            email: 'fox@animal.com',
            company: 'Animal Kingdom',
            number: '789'
        }
    ];

    //store category and country
    vm.fields = {};

    vm.getData = function() {

        vm.fields.push({
            category: vm.scrapData.category,
            country: vm.scrapData.country
        });

        //clear after fields has been added
        vm.scrapData = {};
    }

    vm.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    columnDefs: [
      { field: 'firstName', headerCellClass: vm.highlightFilteredHeader },
      { field: 'lastName', headerCellClass: vm.highlightFilteredHeader  },
      { field: 'company', enableSorting: false },
      { field: 'employed', filter: {
        term: true,
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
        },
        cellFilter: 'mapEmployed', headerCellClass: vm.highlightFilteredHeader },
    ],
    onRegisterApi: function( gridApi ) {
      vm.gridApi = gridApi;
    }
  };  
});