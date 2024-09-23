class Transaction {

    fields = {
        addTransactionForm: document.querySelector('#addTransactionForm'),
        updateTransactionForm: document.querySelector('#updateTransactionForm')
    }
    Table = null;

    constructor() {
        this.getCategories();
        this.initDTtable();
        this.bindListners();

    }

    initDTtable() {
        this.Table = new DataTable('#transactionTable', {
            "ajax": {
                "dataType": 'json',
                "headers": { 'X-AT-SessionToken': localStorage.sessionToken },
                "type": "GET",
                "url": '/transaction/get',
                "dataSrc": "data"
            },
            dom: '<"top"l<"center-div"B>f>rt<"bottom"ip>',  // Custom DOM layout
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            scrollY: '40vh',
            scrollCollapse: true,
            columnDefs: [
                { "className": "text-center", "targets": '_all' }
            ],
            "lengthMenu": [
                [5, 20, 100, -1],
                [5, 20, 100, "All"]
            ],
            "order": [['0', 'desc']],
            "scrollX": true,
            columns: [
                {
                    data: 'id',
                },
                {
                    data: 'type',
                    render: (data, type, full) => {
                        return data == 0 ? 'Income' : 'Expense';
                    }
                },
                {
                    data: 'Category',
                    render: (data, type, full) => {
                        return data && data.name && data.id ? `${data.name} (${data.id})` :''
                    }
                },
                {
                    data: 'amount',
                    render: (data, type, full) => {
                        return data || '';
                    }
                },
                {
                    data: 'date',
                    render: (data) => {
                        return moment(data).format('DD-MM-YYYY hh:mm A');
                    }
                },
                {
                    data: 'notes',
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
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();
                let filteredData = api.rows({ search: "applied" }).data().toArray();

                let amount = 0;
                for (let data of filteredData) {
                    amount += Number(data.amount);
                }
                $(api.column(0).footer()).html('Total');
                $(api.column(3).footer()).html(amount);
            }
        });
    }

    addTransaction(e) {
        e.preventDefault();
        $('#saveAddTransaction').prop('disabled', true); 
        $.ajax({
            type: 'POST',
            url: '/transaction/add',
            data: $('#addTransactionForm').serialize(),
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            if (response.success === true) {
                $('#transactionTable').DataTable().ajax.reload();
                $('#saveAddTransaction').prop('disabled', false);
                $('#addtransactionModal').modal('hide');
                document.getElementById('addTransactionForm').reset();

            } else {
                ('#saveAddTransaction').prop('disabled', false);
                alert(response.error || 'Error saving data');
            };
        });
    }

    getCategories() {
        $.ajax({
            type: 'GET',
            url: '/category/get/category',
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            if (response.success === true) {
                $('#addTransactionForm #category').select2({
                    placeholder: 'Select Status',
                    allowClear: true,
                    data: response.data.map(function (x) {
                        return {
                            id: x.id,
                            text: `${x.name} (${x.id})`,
                            type: x.type
                        }
                    })
                }).val(null).trigger('change');
            } else {
                alert(response.error || 'Error fetching Categories');
            };
        });
    }

    displayUpdateTransaction() {
        const clickedRow = $(this).closest('tr');
        const rowData = $('#transactionTable').DataTable().row(clickedRow).data();
        $('#updateCategory').val(rowData.category);
        $('#updateType').val(rowData.type);
        $('#updateDate').val(moment(rowData.date).format('YYYY-MM-DDTHH:MM'));
        $('#updateAmount').val(rowData.amount);
        $('#updateNotes').val(rowData.notes);
        $('#updateTransactionForm #id').val(rowData.id)
        $('#updateTransaction').modal('show');
    }

    updateTransaction(e) {
        e.preventDefault();
        $('#saveUpdateTransaction').prop('disabled', true);
        $.ajax({
            type: 'PUT',
            url: '/transaction/update/' + $('#updateTransactionForm #id').val(),
            data: $('#updateTransactionForm').serialize(),
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            if (response.success === true) {
                $('#transactionTable').DataTable().ajax.reload();
                $('#updateTransaction').modal('hide');   
                $('#saveUpdateTransaction').prop('disabled', false);
            } else {
                ('#saveUpdateTransaction').prop('disabled', false);
                alert(response.error || 'Error saving data');
            };
        });
    }

    deleteTransaction() {
        const clickedRow = $(this).closest('tr');
        const rowData = $('#transactionTable').DataTable().row(clickedRow).data();
        var answer = window.confirm("are you sure to delete?");
        if (answer) {
            $.ajax({
                type: 'DELETE',
                url: '/transaction/delete/' + rowData.id,
                headers: { 'X-AT-SessionToken': localStorage.sessionToken }
            }).done(function (response) {
                if (response.success === true) {
                    alert('Deleted')
                    $('#transactionTable').DataTable().ajax.reload();
                } else {
                    alert(response.error || 'Error saving data');
                };
            });
        }
        else {
            //some code
        }
    }

    bindListners() {
        document.querySelector('#addTransactionForm').addEventListener('submit', this.addTransaction);
        document.querySelector('#updateTransactionForm').addEventListener('submit', this.updateTransaction);
        $('#transactionTable tbody').on('click', '.update', this.displayUpdateTransaction);
        $('#transactionTable tbody').on('click', '.delete', this.deleteTransaction);
        $('#addTransactionForm #category').on('select2:select', function (e) {
            const selectedData = e.params.data;
            $('#addTransactionForm #type').val(selectedData.type)
        });
    }
}

Transaction = new Transaction();