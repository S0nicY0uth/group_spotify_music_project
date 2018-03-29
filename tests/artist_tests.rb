describe Artist do

  describe "validations" do 
    it "should have a unique name" do
      a = Artist.create(name:'Oasis',country:'UK')
      a.errors.messages.must_equal({:name=>["has already been taken"]})
    end
  end  
end
