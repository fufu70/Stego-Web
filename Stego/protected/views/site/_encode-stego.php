<div class="modal fade" id="encode_stego" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- Create Modifier Form -->
            <form id="encode_stego_form" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Encode Stego</h4>
                </div>
                <div class="modal-body">
                    <canvas id="myCanvasEncode" width="578" height="200" style="display:none;"></canvas>
                    <img id="canvasImgEncode" alt="Right click to save me!">
                    <div class="form-group">
                        <label for="Sale_description" id="Sale_description_label" class="control-label">Stego Image</label>
                        <input name="Business[business_logo]" id="Encode_companyLogo" type="file" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="Sale_description" id="Sale_description_label" class="control-label">Stego content</label>
                        <textarea name="Sale[sale_description]" type="text" id="Encode_description_create" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-group btn-group-justified">
                        <div class="btn-group">
                            <button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="encode_stego_submit_button" data-loading-text="Loading..." autocomplete="off" type="button">Encode</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    </div>
</div>

<script type="text/javascript">
    $('#encode_stego_submit_button').click(function() {
        var colorMap = hideInImage($('#Encode_companyLogo')[0].files[0], $('#Encode_description_create').val());
    });
</script>