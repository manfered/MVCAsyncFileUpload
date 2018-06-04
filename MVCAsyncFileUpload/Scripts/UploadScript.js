(function () {
    var bar = $('.progress-bar');
    var percent = $('.progress-bar');
    var uploadFormBox = $('#uploadFormBox');
    var uploadProgressBox = $('#uploadProgressBox');
    var uploadResultBox = $('#uploadResultBox')
    var fileUploadInput = $('#fileUploadInput');
    var fileUploadStatus = $('#fileUploadStatus');


    ///
    ///
    //defining the settings
    ///
    ///

    var MVCFileUploadAsyncUploadTypes = {
        Single: 1,
        Mulitiple: 2
    };

    var MVCFileUploadAsyncAcceptFileFormats = {
        Image: 1,
        Document: 2,
        All: 3
    };
    var acceptedImageFormats = "image/x-png,image/gif,image/jpeg";
    var acceptedImageFormats2 = "image/*";
    var acceptedDocumentFormats = "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf";

    var MVCFileUploadAsyncPreview = {
        Image: 1,
        ImageWithDelete: 2,
        Text: 3,
        TextWithDelete: 4,
        HyperText: 5,
        HyperTextWithDelete: 6,
        None: 7
    };

    var MVCFileUploadAsyncProgressBar = {
        Show: 1,
        Hide: 2
    };

    var MVCFileUploadAsyncAlert = {
        Show: 1,
        Hide: 2
    };

    var MVCFileUploadAsyncStatusText = {
        Show: 1,
        Hide: 2
    };

    ///
    ///
    //set the settings
    ///
    ///

    var uploadType = MVCFileUploadAsyncUploadTypes.Mulitiple;
    var uploadAcceptFileFormats = MVCFileUploadAsyncAcceptFileFormats.Image;
    var uploadPreview = MVCFileUploadAsyncPreview.ImageWithDelete;
    var uploadProgressBar = MVCFileUploadAsyncProgressBar.Show;
    var uploadAlert = MVCFileUploadAsyncAlert.Hide;
    var uploadStatus = MVCFileUploadAsyncStatusText.Hide;


    ///
    ///
    //afecting the settings
    ///
    ///

    //setting the accepted file formats for input type file
    if (uploadAcceptFileFormats === MVCFileUploadAsyncAcceptFileFormats.Image) {
        fileUploadInput.attr("accept", acceptedImageFormats);
    }
    else if (uploadAcceptFileFormats === MVCFileUploadAsyncAcceptFileFormats.Document) {
        fileUploadInput.attr("accept", acceptedDocumentFormats);
    }

    //setting the hide/show of progressbar
    //it will be shown just before the upload progress strarts
    uploadProgressBox.hide();



    //number of uploaded files
    var formCount = 0;

    function addForm(container) {

        var dynamicForm = document.createElement("input");
        dynamicForm.setAttribute("type", "file");
        dynamicForm.setAttribute("id", "files");
        dynamicForm.setAttribute("name", "imgs[]");
        dynamicForm.setAttribute("multiple", "");

        container.append(dynamicForm);
    }

    function addResult(container, resultSrc, fileName) {

        //add 1 to amount of uploaded files
        ++formCount;

        if (uploadPreview != MVCFileUploadAsyncPreview.None) {
            var divFull = document.createElement("div");
            var divFullId = "resultRow-" + formCount;
            divFull.setAttribute("class", "is-table-row");
            divFull.setAttribute("id", divFullId);


            var divLeft = document.createElement("div");

            if (uploadPreview == MVCFileUploadAsyncPreview.ImageWithDelete ||
                uploadPreview == MVCFileUploadAsyncPreview.Image) {
                var imgPreview = document.createElement("img");
                imgPreview.setAttribute("class", "img-result");
                imgPreview.setAttribute("src", resultSrc);

                divLeft.appendChild(imgPreview);
            }

            if (uploadPreview == MVCFileUploadAsyncPreview.TextWithDelete ||
                uploadPreview == MVCFileUploadAsyncPreview.Text) {
                var textPreview = document.createTextNode(resultSrc);

                divLeft.appendChild(textPreview);
            }

            if (uploadPreview == MVCFileUploadAsyncPreview.HyperTextWithDelete ||
                uploadPreview == MVCFileUploadAsyncPreview.HyperText) {
                var hyperText = document.createElement('a');
                var linkText = document.createTextNode(resultSrc);
                hyperText.setAttribute('href', resultSrc);
                hyperText.setAttribute('title', resultSrc);
                hyperText.appendChild(linkText);

                divLeft.appendChild(hyperText);
            }


            if (uploadPreview == MVCFileUploadAsyncPreview.ImageWithDelete ||
                uploadPreview == MVCFileUploadAsyncPreview.TextWithDelete ||
                uploadPreview == MVCFileUploadAsyncPreview.HyperTextWithDelete) {
                //we need to have two diffrent divs and a delete button
                var divRight = document.createElement("div");
                divLeft.setAttribute("class", "col-xs-10 upload-preview-div align-middle justify-content-center text-center");
                divRight.setAttribute("class", "col-xs-2 delete-Button-div align-middle justify-content-center text-center");

                divFull.appendChild(divLeft);

                addDeleteButton(divRight, fileName, formCount);

                divFull.appendChild(divRight);

                //add hidden input type to send rowId
                //var dynamicHiddenRowID = document.createElement("input");
                //dynamicHiddenRowID.setAttribute("type", "hidden");
                //dynamicHiddenRowID.setAttribute("value", divFullId);
                //dynamicHiddenRowID.setAttribute("name", "resultRowId")
                //divFull.append(dynamicHiddenRowID);

            }
            else {
                divLeft.setAttribute("class", "col-xs-12 align-middle justify-content-center text-center");

                divFull.append(divLeft);
            }



            container.append(divFull);
        }

    }

    function addDeleteButton(container, deleteFileName, rowNumber) {
        var dynamicDelete = document.createElement("input");
        dynamicDelete.setAttribute("type", "submit");
        //we can get the row number by spliting the id //split('-');
        dynamicDelete.setAttribute("id", "deleteuplodedFile-" + rowNumber);
        dynamicDelete.setAttribute("value", "Delete File");
        dynamicDelete.setAttribute("class", "btn btn-danger");

        container.append(dynamicDelete);

        var dynamicHiddenFileName = document.createElement("input");
        dynamicHiddenFileName.setAttribute("type", "hidden");
        dynamicHiddenFileName.setAttribute("value", deleteFileName);
        dynamicHiddenFileName.setAttribute("id", "deletFileName-" + rowNumber)
        container.append(dynamicHiddenFileName);
    }

    function showStatus(statusStr) {
        var statusElement = document.createTextNode(statusStr);
        fileUploadStatus.append(statusElement);
    }

    function emptyStatus() {
        fileUploadStatus.empty();
    }

    function deleteResult(container, rowID) {
        $('#resultRow-' + rowID).hide();
    }

    //capturing the event of selecting file by user in browse window
    $(document).ready(function () {
        $('input[type="file"]').change(function () {

            //setting of showing alerts
            if (uploadAlert == MVCFileUploadAsyncAlert.Show) {
                alert("A file has been selected.");
            }

            if (uploadProgressBar == MVCFileUploadAsyncProgressBar.Show) {
                uploadProgressBox.show();
            }


            //.ajaxSubmit submit immediately
            //.AjaxForm submit by clicking the submit button
            $('#form1').ajaxSubmit({
                beforeSend: function () {
                    emptyStatus();
                    var percentValue = '0%';
                    bar.width(percentValue);
                    percent.html(percentValue);
                },
                uploadProgress: function (event, position, total, percentComplete) {
                    var percentValue = percentComplete + '%';
                    bar.width(percentValue);
                    percent.html(percentValue);
                },
                success: function (d) {
                    var percentValue = '100%';
                    bar.width(percentValue);
                    percent.html(percentValue);
                    //$('#fu1').val('');
                    //$('#file-upload').val('');
                    fileUploadInput.val('');
                },
                complete: function (xhr) {

                    //setting single or multi file upload
                    if (uploadType == MVCFileUploadAsyncUploadTypes.Single) {
                        uploadFormBox.hide();
                    }

                    var obj = jQuery.parseJSON(xhr.responseText);

                    //setting alert status
                    if (uploadAlert == MVCFileUploadAsyncAlert.Show) {
                        alert(obj.Data);
                    }

                    //setting status
                    if (uploadStatus == MVCFileUploadAsyncStatusText.Show) {
                        showStatus(obj.Data);
                    }

                    addResult(uploadResultBox, obj.src, obj.fileName);

                }
            });
        });
    });

    var deleteButtonClickedId;
    var rowIdCatcherArr;

    $('#form0').ajaxForm({
        beforeSerialize: function () {
            uploadProgressBox.hide();
            //finding which delete button has been clicked
            deleteButtonClickedId = document.activeElement.id;
            rowIdCatcherArr = deleteButtonClickedId.split('-');
            //use the row number to populate hidden fields to send to mvc controller
            $('#deletFileName').val($('#deletFileName-' + rowIdCatcherArr[1]).val());

        },
        success: function (d) {
            //fileUploadInput.val('');
        },
        complete: function (xhr) {

            var obj = jQuery.parseJSON(xhr.responseText);

            //setting alert status
            if (uploadAlert == MVCFileUploadAsyncAlert.Show) {
                alert(obj.Data);
            }

            //setting status
            if (uploadStatus == MVCFileUploadAsyncStatusText.Show) {
                showStatus(obj.Data);
            }

            //delete result
            //deleteResult(uploadResultBox, obj.resultRowId);
            deleteResult(uploadResultBox, rowIdCatcherArr[1]);
            //addResult(uploadResultBox, obj.src, obj.fileName);

        }
    });


})();
