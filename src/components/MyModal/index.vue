<template>
  <b-modal
    :id="id"
    :title="title"
    :cancel-title="$t(cancelTitle)"
    :ok-title-html="okTitleHtml"
    footer-class="my-modal-footer"
    @ok="handleOk"
    @hide="handleHide"
  >
    <slot />
  </b-modal>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'MyModal',
  props: {
    id: {
      type: String,
      default: 'modal'
    },
    title: {
      type: String,
      default: 'Modal'
    },
    cancelTitle: {
      type: String,
      default: 'modal.cancel'
    },
    okTitle: {
      type: String,
      default: 'modal.confirm'
    }
  },
  data() {
    return {
      isLoading: false,
      okTitleHtml: this.$t(this.okTitle)
    };
  },
  methods: {
    show(obj) {
      this.obj = obj;
      this.$bvModal.show(this.id);
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.isLoading = true;
      $('#' + this.id + ' div.alert').remove();

      this.okTitleHtml = `
        <div class="modal-confirm-loading">
          <span class="spinner-border spinner-border-sm"></span>
        </div>
      `;

      this.$emit('ok', this.finish, this.obj);
    },
    handleHide(bvModalEvt) {
      if (bvModalEvt && bvModalEvt.trigger !== 'ok') {
        this.isLoading = false;
        this.okTitleHtml = this.$t(this.okTitle);
      }
    },
    finish(status, message) {
      if (status !== 'success') {
        $('#' + this.id + ' footer').after(`
          <div style="padding: 0px 15px 0px 15px">
            <div role="alert" class="alert alert-warning">
              ${message}
            </div>
          </div>
        `);

        this.isLoading = false;
        this.okTitleHtml = this.$t(this.okTitle);
      } else {
        setTimeout(() => {
          this.$bvModal.hide(this.id);
        }, 100);
      }
    }
  }
};
</script>
