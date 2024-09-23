class Category {
    fields = {
        addTransactionForm: document.querySelector('#addTransactionForm'),
        updateTransactionForm: document.querySelector('#updateTransactionForm')
    }
    Table = null;

    constructor() {
        this.initDTtable();
        this.bindListners(); 
    }

    initDTtable() {
        this.Table = new DataTable('#categoryTable', {
            "ajax": {
                "dataType": 'json',
                "headers": { 'X-AT-SessionToken': localStorage.sessionToken },
                "type": "GET",
                url: '/category/get',
                "dataSrc": "data"
            },
            scrollY: '40vh',
            scrollCollapse: true,
            columnDefs: [
                {"className": "text-center", "targets":'_all'}
              ],
            "lengthMenu": [
                [5, 20, 100, -1],
                [5, 20, 100, "All"]
            ],
            "order": [['0', 'desc']],
            "scrollX": true,
            dom: '<"top"l<"center-div"B>f>rt<"bottom"ip>',  // Custom DOM layout
            buttons: [
                  'copy', 'csv', 'excel', 'pdf', 'print'
              ],
 
            columns: [
                {   data: 'id',
                    render: (data) => {
                        return data || '';
                    }
                },
                {   data: 'name',
                    render: (data) => {
                        return data || '';
                    }
                },
                {   data: 'type',
                    render: (data) => {
                        if(data == 0) {
                            return 'Income'
                        } else {
                            return 'Expense'
                        }   
                    }
                },
                {   data: 'notes',
                    render: (data) => {
                        return data || '';
                    }
                },
                {   data: 'CreatedAt',
                    render: (data) => {
                        return data && moment(data).format('DD-MM-YYYY hh:mm A') || '';
                    }
                },
                {
                    data: '',
                    render: function (data, type, full) {
                            let buttons = '';
                            buttons += '<a data-id="' + full.id + '" class="update btn btn-default btn-xs" style="margin-bottom: 3px;")>Update</a> &nbsp'
                            buttons += ' <a data-id="' + full.id + '" class="delete btn btn-default btn-xs" style="margin-bottom: 3px;">Delete</a>'
                            return buttons;
                    }
                }
               
            ],
        });
    }

    async addTransaction(e) {
        e.preventDefault();
        $('#saveUpdateCategory').prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/category/add',
            data: $('#addCategoryForm').serialize(),
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            if (response.success === true) {
                $('#categoryTable').DataTable().ajax.reload();
                $('#categoryEntryModal').modal('hide');
                $('#saveUpdateCategory').prop('disabled', false);
            } else {
                ('#saveUpdateCategory').prop('disabled', false);
                alert(response.error || 'Error saving data'); 
            };
        });
    }

    displayUpdateTransaction() {
            const clickedRow = $(this).closest('tr');
            const rowData = $('#categoryTable').DataTable().row(clickedRow).data();
            console.log(rowData);
            $('#updateType').val(rowData.type);    
            $('#updateName').val(rowData.name);  
            $('#updateNotes').val(rowData.notes); 
            $('#updateCategoryForm #id').val(rowData.id) 
            $('#updateTransaction').modal('show');
    }

    updateTransaction(e) {
        e.preventDefault();
        $.ajax({
            type: 'PUT',
            url: '/category/update/'+$('#updateCategoryForm #id').val(),
            data: $('#updateCategoryForm').serialize(),
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            $('#saveUpdateCategory').prop('disabled', true);
            if (response.success === true) {
                $('#categoryTable').DataTable().ajax.reload();
                $('#updateTransaction').modal('hide');
                $('#saveUpdateCategory').prop('disabled', false);
            } else {
                ('#saveUpdateCategory').prop('disabled', false);                
                alert(response.error || 'Error saving data');
            };
        });
    }

    deleteTransaction() {
        const clickedRow = $(this).closest('tr');
        const rowData = $('#categoryTable').DataTable().row(clickedRow).data();
        var answer = window.confirm("are you sure to delete?");
        if (answer) {
            $.ajax({
                type: 'DELETE',
                url: '/category/delete/'+rowData.id,
                headers: { 'X-AT-SessionToken': localStorage.sessionToken }
            }).done(function (response) {
                if (response.success === true) {
                    alert('Deleted')
                    $('#categoryTable').DataTable().ajax.reload();
                } else {
                    alert(response.error || 'Error saving data');
                };
            });
        }
    }

    bindListners() {
        document.querySelector('#addCategoryForm').addEventListener('submit', this.addTransaction);
        document.querySelector('#updateCategoryForm').addEventListener('submit', this.updateTransaction);
        $('#categoryTable tbody').on('click','.update', this.displayUpdateTransaction);
        $('#categoryTable tbody').on('click','.delete', this.deleteTransaction);

    }
}

Category = new Category();