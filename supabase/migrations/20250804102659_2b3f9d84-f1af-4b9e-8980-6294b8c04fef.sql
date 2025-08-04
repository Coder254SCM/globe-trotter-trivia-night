-- Create quality_reports table for community quality management
CREATE TABLE public.quality_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id VARCHAR NOT NULL,
    reported_by UUID NOT NULL,
    issue_type VARCHAR NOT NULL CHECK (issue_type IN ('duplicate', 'irrelevant', 'incorrect', 'inappropriate', 'poor_quality')),
    description TEXT NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    moderated_by UUID,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moderation_actions table to track moderator actions
CREATE TABLE public.moderation_actions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id VARCHAR NOT NULL,
    moderator_id UUID NOT NULL,
    action VARCHAR NOT NULL CHECK (action IN ('approve', 'reject', 'edit', 'flag')),
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quality_reports
CREATE POLICY "Users can submit quality reports" ON public.quality_reports
    FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view their own reports" ON public.quality_reports
    FOR SELECT USING (auth.uid() = reported_by);

CREATE POLICY "Moderators can view all reports" ON public.quality_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Moderators can update reports" ON public.quality_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- RLS Policies for moderation_actions
CREATE POLICY "Moderators can create actions" ON public.moderation_actions
    FOR INSERT WITH CHECK (
        auth.uid() = moderator_id AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Moderators can view all actions" ON public.moderation_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Add indexes for performance
CREATE INDEX idx_quality_reports_status ON public.quality_reports(status);
CREATE INDEX idx_quality_reports_question_id ON public.quality_reports(question_id);
CREATE INDEX idx_quality_reports_reported_by ON public.quality_reports(reported_by);
CREATE INDEX idx_moderation_actions_question_id ON public.moderation_actions(question_id);
CREATE INDEX idx_moderation_actions_moderator_id ON public.moderation_actions(moderator_id);