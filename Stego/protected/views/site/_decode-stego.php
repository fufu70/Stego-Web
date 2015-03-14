<div class="modal fade" id="decode_stego" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- Create Modifier Form -->
            <form id="decode_stego_form" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Decode Stego</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <canvas id="myCanvasDecode" width="578" height="200" style="display:none;"></canvas>
                        <label for="Sale_description" id="Sale_description_label" class="control-label">Stego content</label>
                        <input name="Business[business_logo]" id="Business_companyLogo" type="file" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-group btn-group-justified">
                        <div class="btn-group">
                            <button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="decode_stego_submit_button" data-loading-text="Loading..." autocomplete="off" type="button">decode</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    </div>
</div>

<script type="text/javascript">
    $('#decode_stego_submit_button').click(function() {
        pullFromImage($('#Business_companyLogo')[0].files[0]);
    });
</script>