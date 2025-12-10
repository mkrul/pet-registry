# frozen_string_literal: true

require 'pagy/extras/overflow'
require 'pagy/extras/metadata'

Pagy::DEFAULT[:limit] = 12
Pagy::DEFAULT[:overflow] = :last_page
