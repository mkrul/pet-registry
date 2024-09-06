require 'rails_helper'

RSpec.describe "reports/edit", type: :view do
  let(:report) {
    Report.create!()
  }

  before(:each) do
    assign(:report, report)
  end

  it "renders the edit report form" do
    render

    assert_select "form[action=?][method=?]", report_path(report), "post" do
    end
  end
end
